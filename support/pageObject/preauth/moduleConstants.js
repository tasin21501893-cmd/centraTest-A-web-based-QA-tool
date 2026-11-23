/**
* @author Paul Richie Gomes
* @since 12/30/2025
*/

export const EXCEL_YES = 'Yes';

export const STATUS = Object.freeze({
    NEW: 'New',
    DRAFT: 'Draft',
    APPROVED: 'Approved',
    PENDING: 'Pending Approval',
    PENDING_UPDATE: 'Pending Update Approval',
    UPDATING: 'Updating',
    RETURNED: 'Returned',
    RETURNED_UPDATER: 'Returned To Updater',
    REJECTED: 'Rejected',
    SENT: 'Sent',
    READY_TRANSFER: 'Ready For Transfer',
    DELETED: 'Deleted',
    ACKNOWLEDGED: 'Acknowledged',
    PENDING_ACKNOWLEDGE: 'Pending Acknowledgement',
    PENDING_UPDATE_ACKNOWLEDGE: 'Pending Update Acknowledgement',
});

export const ACTION = Object.freeze({
    SAVE: 'Save',
    SUBMIT: 'Submit',
    APPROVE: 'Approve',
    EDIT: 'Edit',
    UPDATE: 'Update',
    DELETE: 'Delete',
    RETURN: 'Return',
    ADD_COMMENTS: 'Add Comments',
    COPY: 'Copy',
    NEXT: 'Next',
    REPLACE: 'REPLACE',
    CREATE: 'CREATE',
    REMOVE: 'REMOVE',
});

export const TRANSITION_PATHS = Object.freeze({
    [STATUS.NEW]: {
        [STATUS.DRAFT]: [ACTION.SAVE]
    },
    [STATUS.DRAFT]: {
        [STATUS.PENDING]: [ACTION.SUBMIT],
        [STATUS.APPROVED]: [ACTION.SUBMIT, ACTION.APPROVE],
        [STATUS.DELETED]: [ACTION.DELETE]
    },
    [STATUS.PENDING]: {
        [STATUS.APPROVED]: [ACTION.APPROVE],
        [STATUS.RETURNED]: [ACTION.RETURN]
    },
    [STATUS.APPROVED]: {
        [STATUS.UPDATING]: [ACTION.EDIT, ACTION.UPDATE],
        [STATUS.DELETED]: [ACTION.DELETE]
    },
    [STATUS.UPDATING]: {
        [STATUS.PENDING_UPDATE]: [ACTION.SUBMIT],
        [STATUS.APPROVED]: [ACTION.SUBMIT, ACTION.APPROVE],
        [STATUS.DELETED]: [ACTION.DELETE]
    },
    [STATUS.PENDING_UPDATE]: {
        [STATUS.APPROVED]: [ACTION.APPROVE],
        [STATUS.RETURNED_UPDATER]: [ACTION.RETURN]
    },
    [STATUS.RETURNED]: {
        [STATUS.PENDING]: [ACTION.SUBMIT],
        [STATUS.APPROVED]: [ACTION.SUBMIT, ACTION.APPROVE],
        [STATUS.DELETED]: [ACTION.DELETE]
    },
    [STATUS.RETURNED_UPDATER]: {
        [STATUS.PENDING_UPDATE]: [ACTION.SUBMIT],
        [STATUS.APPROVED]: [ACTION.SUBMIT, ACTION.APPROVE],
        [STATUS.DELETED]: [ACTION.DELETE]
    }
});