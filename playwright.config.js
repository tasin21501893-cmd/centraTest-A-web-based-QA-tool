import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Constants for Firefox and WebKit viewport dimensions
const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;

const reporters = [
  ['list'],
  ['html', { open: 'never' }],
  ['monocart-reporter', {
    name: "Test Report",
    outputFile: './monocart-results/Test-Report.html'
  }],
];

try {
  if (typeof require !== 'undefined' && require.resolve) {
    require.resolve('allure-playwright');
    reporters.push([
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: true,
      },
    ]);
  }
} catch (e) {
  // allure-playwright is optional
}

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* timeout 0 means NO TIMEOUT LIMIT. In case it is necessary to set a non-zero value, you can independently call test.setTimeout(timeout) inside that specific test() block.*/
  timeout: 0,

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  //retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  //workers: process.env.CI ? 5 : undefined,
  workers: 1,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: reporters,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "https://qa01.therapbd.net/",
    actionTimeout: 35 * 1000,

    /* Global launch options to maximize Chromium-based browsers */
    launchOptions: {
      args: ['--start-maximized']
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,

    /* Auto-attach screenshots to reporters on test failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'module-setup',
      testMatch: getModuleSetupMatch(),
    },

    {
      name: 'chromium',
      use: {
        viewport: null,
        permissions: ["clipboard-read"],
      },
      dependencies: ['module-setup'],
    },

    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
      },
      dependencies: ['module-setup'],
    },

    {
      name: 'microsoftEdge',
      use: {
        channel: 'msedge',
        viewport: null,
      },
      dependencies: ['module-setup'],
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
        extraHTTPHeaders: {
          'Accept-Encoding': 'identity'
        }
      },
      dependencies: ['module-setup'],
    },
  ],
});

/**
 * Recursively search a directory for any files or folders matching a keyword.
 */
function findModuleFromKeyword(dir, keyword) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fullPath.toLowerCase().includes(keyword.toLowerCase())) {
      // Return the top-level module folder inside 'tests/'
      const relativePath = path.relative(path.resolve('./tests'), fullPath);
      return relativePath.split(path.sep)[0];
    }
    if (fs.statSync(fullPath).isDirectory()) {
      const result = findModuleFromKeyword(fullPath, keyword);
      if (result) return result;
    }
  }
  return null;
}

/**
 * Dynamically match module-level setups based on targeted directories.
 */
function getModuleSetupMatch() {
  const isWorkerProcess = process.argv[1] && process.argv[1].includes('workerProcessEntry');

  // Extract the target paths (handling flags with values correctly)
  const flagsWithValues = new Set([
    '--grep', '-g', '--grep-invert',
    '--project', '--reporter',
    '--config', '-c',
    '--output', '--workers', '-j',
    '--retries', '--timeout', '--global-timeout'
  ]);
  const cliTargetedPaths = [];
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('-')) {
      // If the flag expects a value and doesn't use '=' inline, skip the next argument
      if (flagsWithValues.has(argv[i]) && i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
        i++;
      }
    } else if (argv[i] !== 'test') {
      cliTargetedPaths.push(argv[i]);
    }
  }

  // Workers don't get original CLI args, so we pass them via an environment variable
  if (!isWorkerProcess) {
    process.env.TARGETED_TEST_PATHS = JSON.stringify(cliTargetedPaths);
  }

  const targetPaths = process.env.TARGETED_TEST_PATHS ? JSON.parse(process.env.TARGETED_TEST_PATHS) : [];

  let moduleSetupMatch = [];

  if (targetPaths.length > 0) {
    const targetModules = new Set();

    targetPaths.forEach(tPath => {
      const normalized = tPath.replace(/\\/g, '/');
      const parts = normalized.split('/').filter(Boolean);

      let moduleName = '';
      if (parts[0] === 'tests' && parts.length > 1) {
        moduleName = parts[1];
      } else if (parts[0] !== 'tests' && parts.length > 0) {
        // If it's a file path like "employmentHistory/agency/..."
        if (fs.existsSync(path.join('./tests', parts[0]))) {
          moduleName = parts[0];
        } else {
          // It might just be a keyword like "employer". Let's search the tests directory.
          const foundModule = findModuleFromKeyword(path.resolve('./tests'), parts[0]);
          if (foundModule) {
            moduleName = foundModule;
          }
        }
      }

      if (moduleName) {
        targetModules.add(`tests/${moduleName}/**/*.setup.js`);
      }
    });

    targetModules.forEach(modPath => moduleSetupMatch.push(modPath));
  } else {
    moduleSetupMatch.push('tests/*/**/*.setup.js');
  }

  // If we couldn't resolve a specific module, default to all setups to be safe
  if (moduleSetupMatch.length === 0) {
    moduleSetupMatch.push('tests/*/**/*.setup.js');
  }

  return moduleSetupMatch;
}
