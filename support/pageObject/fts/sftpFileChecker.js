/**
 * @author Shaikh Nahian
 * @since 04/06/2026
 */
import { Client } from 'ssh2';
import fs from 'fs';
import { customLog } from '../../helper/fts/ftsCustomLog.js';



export class SftpFileChecker {

    /**
     * @param {Object} mergedTestCase — a single merged row produced by the spec
     * @param {string} baseURL — the baseURL being used (to determine environment)
     * @param {string} appServerHost — the app server host for QA LOCAL checks
     */
    constructor(mergedTestCase, baseURL = '', appServerHost = '', loginRow = {}) {
        this.tc = mergedTestCase;
        this.baseURL = baseURL;
        this.appServerHost = appServerHost;
        this.loginRow = loginRow;

        const isQa = this.appServerHost || (this.baseURL && !this.baseURL.includes('therapdev'));
        const envUser = isQa ? process.env.QA_JUMP_USER : process.env.LOCAL_JUMP_USER;
        const envPassword = isQa ? process.env.QA_JUMP_PASSWORD : process.env.LOCAL_JUMP_PASSWORD;

        // Build dynamic jump host configuration from the Excel login row
        this.jumpHostOpts = {
            host: this.loginRow.jumpHost || '',
            port: 22,
            username: envUser || this.loginRow.jumpUsername || 'sqa',
            password: envPassword || this.loginRow.jumpPassword || '',
        };

        /** @private Cache of source files,needed because removePolicy=Yes deletes them */
        this._cachedSourceFiles = null;
    }

    /**
     * Lists files found in the **source** path.
     */
    async checkFilesOnSource() {
        const remotePath = this._buildSourcePath();
        return this._listFiles({
            contextType: this.tc.sContextType,
            host: this.tc.sHost,
            port: this.tc.sPort,
            username: this.tc.sUsername,
            password: this.tc.sPassword,
            authType: this.tc.sAuthType,
            privateKeyPath: this.tc.sPrivateKeyPath,
            passphrase: this.tc.sNewPassphrase,
        }, remotePath);
    }

    /**
     * Lists ALL files found in the **destination** path (unfiltered).
     */
    async checkFilesOnDestination() {
        const remotePath = this._buildDestinationPath();
        return this._listFiles({
            contextType: this.tc.dContextType,
            host: this.tc.dHost,
            port: this.tc.dPort,
            username: this.tc.dUsername,
            password: this.tc.dPassword,
            authType: this.tc.dAuthType,
            privateKeyPath: this.tc.dPrivateKeyPath,
            passphrase: this.tc.dNewPassphrase,
        }, remotePath, { skipFilter: true });
    }

    async verifyFilesTransferredToDestination() {
        const fileType = (this.tc.sourceFileType || '').trim();
        const pattern = (this.tc.sourceFilePattern || '').trim();
        const shouldRemoveSource = (this.tc.sourceRemovePolicy || '').trim() === 'Yes';
        let filesToVerify = [];

        if (fileType === 'File' || fileType === 'DB Storage') {
            filesToVerify = this._getExpectedFileNames();
            if (filesToVerify.length === 0) return false;

        } else if (fileType === 'Directory') {
            const sourceFiles = await this.checkFilesOnSource();
            if (sourceFiles.length > 0) {
                this._cachedSourceFiles = sourceFiles;
                filesToVerify = sourceFiles;
            } else if (this._cachedSourceFiles && shouldRemoveSource) {
                filesToVerify = this._cachedSourceFiles;
            } else {
                return false;
            }
        } else {
            return false;
        }

        const filesOnDest = await this.checkFilesOnDestination();
        const missing = filesToVerify.filter(name => !filesOnDest.includes(name));

        if (missing.length > 0) {
            customLog(`[SftpFileChecker] Missing on destination: ${missing.join(', ')}`);
            return false;
        }

        if (shouldRemoveSource) {
            const filesStillOnSource = await this.checkFilesOnSource();
            const notRemoved = filesToVerify.filter(name => filesStillOnSource.includes(name));
            if (notRemoved.length > 0) return false;
        }

        return true;
    }

    async pollForTransfer({ 
        timeoutMs = Number(process.env.FTS_POLL_TIMEOUT) || 35 * 60 * 1000, 
        intervalMs = Number(process.env.FTS_POLL_INTERVAL) || 30 * 1000 
    } = {}) {
        const start = Date.now();
        let attempt = 0;

        while (Date.now() - start < timeoutMs) {
            attempt++;
            const elapsed = ((Date.now() - start) / 1000).toFixed(0);
            customLog(`[SftpFileChecker] Poll attempt ${attempt} (${elapsed}s elapsed)…`);

            try {
                const found = await this.verifyFilesTransferredToDestination();
                if (found) return true;
            } catch (err) {
                customLog(`[SftpFileChecker] Poll attempt ${attempt} error: ${err.message}`, true);
            }

            await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
        return false;
    }

    // PATH BUILDERS
    /** @private */
    _buildSourcePath() {
        return this._joinPaths(this.tc.sRootDirectory, this.tc.sourceDirectory);
    }

    /** @private */
    _buildDestinationPath() {
        return this._joinPaths(this.tc.dRootDirectory, this.tc.destinationDirectory);
    }

    /** @private */
    _joinPaths(root, relative) {
        const r = (root || '').replace(/\/+$/, '');
        const d = (relative || '').replace(/^\/+/, '');
        return `${r}/${d}`.replace(/\/+$/, '') || '/';
    }

    // FILE LISTING — routing 

    /**
     * Routes to the correct connection strategy based on contextType and host.
     * @private
     */
    async _listFiles(config, remotePath, { skipFilter = false } = {}) {
        const contextType = (config.contextType || '').toUpperCase();
        const host = (config.host || '').trim();
        const isQA = this.baseURL.includes('qa');

        let allFiles;

        if (contextType === 'LOCAL') {
            if (isQA) {
                allFiles = await this._listFilesOnQaAppServer(remotePath);
            } else {
                allFiles = await this._listFilesOnJumpHost(remotePath);
            }

        } else if (host.includes(process.env.FTS_SFTP_PROXY_PATTERN || 'sftp01')) {
            allFiles = await this._listFilesViaJumpHop(config, remotePath, this.jumpHostOpts);

        } else if (host) {
            const connOpts = this._buildDirectConnOpts(config);
            const conn = await this._sshConnect(connOpts);
            try {
                allFiles = await this._sftpReadDir(conn, remotePath);
            } finally {
                conn.end();
            }
        } else {
            return [];
        }

        if (skipFilter) return allFiles;
        return this._filterFiles(allFiles);
    }

    // CONNECTION STRATEGIES

    /**
     * LOCAL (Dev/Local) — Connect to 190, list files directly.
     * @private
     */
    async _listFilesOnJumpHost(remotePath) {
        const conn = await this._sshConnect(this.jumpHostOpts);
        try {
            return await this._sftpReadDir(conn, remotePath);
        } finally {
            conn.end();
        }
    }

    /**
     * LOCAL (QA) — Connect to ops01, then hop to the specific app server from Excel.
     * @private
     */
    async _listFilesOnQaAppServer(remotePath) {
        const appServerHost = (this.appServerHost || '').trim();
        if (!appServerHost) {
            throw new Error('[SftpFileChecker] QA Local check requested but "appServerHost" is missing.');
        }

        customLog(`[SftpFileChecker] QA Local check: hopping through ${this.jumpHostOpts.host} to ${appServerHost}`);

        const jumpConn = await this._sshConnect(this.jumpHostOpts);
        try {
            const stream = await this._forwardOut(jumpConn, appServerHost, 22);
            
            let targetConn;
            try {
                targetConn = await this._sshConnect({ ...this.jumpHostOpts, host: appServerHost, sock: stream });
            } catch (err) {
                stream.destroy(); // Forcefully close proxy socket stream to avoid dangling handles
                throw err;
            }

            try {
                return await this._sftpReadDir(targetConn, remotePath);
            } finally {
                targetConn.end();
            }
        } finally {
            jumpConn.end();
        }
    }

    /**
     * REMOTE + sftp01 — Hop through the determined jump host.
     * @private
     */
    async _listFilesViaJumpHop(config, remotePath, jumpHost) {
        const jumpConn = await this._sshConnect(jumpHost);
        try {
            const targetOpts = await this._buildHopConnOpts(jumpConn, config);
            const stream = await this._forwardOut(jumpConn, targetOpts.host, targetOpts.port);
            
            let targetConn;
            try {
                targetConn = await this._sshConnect({ ...targetOpts, sock: stream });
            } catch (err) {
                stream.destroy(); // Forcefully close proxy socket stream to avoid dangling handles
                throw err;
            }

            try {
                return await this._sftpReadDir(targetConn, remotePath);
            } finally {
                targetConn.end();
            }
        } finally {
            jumpConn.end();
        }
    }

    _buildDirectConnOpts(config) {
        const opts = { host: config.host, port: Number(config.port) || 22, username: config.username };
        const type = (config.authType || '').toUpperCase();
        if (type.includes('PASSWORD')) opts.password = config.password;
        if (type.includes('KEY') && config.privateKeyPath) {
            try { opts.privateKey = fs.readFileSync(config.privateKeyPath); } catch (err) { }
            if (config.passphrase) opts.passphrase = config.passphrase;
        }
        return opts;
    }

    async _buildHopConnOpts(jumpConn, config) {
        const opts = { host: config.host, port: Number(config.port) || 22, username: config.username };
        const type = (config.authType || '').toUpperCase();
        if (type.includes('PASSWORD')) opts.password = config.password;
        if (type.includes('KEY') && config.privateKeyPath) {
            const keyBuffer = await this._readFileFromRemote(jumpConn, config.privateKeyPath);
            if (keyBuffer) opts.privateKey = keyBuffer;
            if (config.passphrase) opts.passphrase = config.passphrase;
        }
        return opts;
    }
    // HELPERS
    _filterFiles(fileNames) {
        const pattern = (this.tc.sourceFilePattern || '').trim();
        const exactNames = this._getExpectedFileNames();
        if (exactNames.length > 0) return fileNames.filter(f => exactNames.includes(f));
        if (pattern) { const regex = new RegExp(pattern); return fileNames.filter(f => regex.test(f)); }
        return fileNames;
    }

    _getExpectedFileNames() {
        const raw = (this.tc.sourceFilename || '').trim();
        if (!raw) return [];
        return raw.split(',').map(n => n.trim()).filter(Boolean);
    }

    _sshConnect(connOpts) {
        return new Promise((resolve, reject) => {
            const conn = new Client();
            conn.on('ready', () => resolve(conn)).on('error', reject).connect(connOpts);
        });
    }

    _forwardOut(conn, dstHost, dstPort) {
        return new Promise((resolve, reject) => {
            conn.forwardOut('127.0.0.1', 0, dstHost, dstPort, (err, stream) => {
                if (err) return reject(err);
                resolve(stream);
            });
        });
    }

    _sftpReadDir(conn, dirPath) {
        return new Promise((resolve, reject) => {
            conn.sftp((err, sftp) => {
                if (err) return reject(err);
                sftp.readdir(dirPath, (err, list) => {
                    if (err) return reject(err);
                    resolve(list.filter(entry => entry.attrs.isFile()).map(entry => entry.filename));
                });
            });
        });
    }

    _readFileFromRemote(conn, filePath) {
        return new Promise((resolve, reject) => {
            conn.sftp((err, sftp) => {
                if (err) return reject(err);
                const chunks = [];
                const readStream = sftp.createReadStream(filePath);
                readStream.on('data', chunk => chunks.push(chunk));
                readStream.on('end', () => resolve(Buffer.concat(chunks)));
                readStream.on('error', (err) => resolve(null));
            });
        });
    }
}

