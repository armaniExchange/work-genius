export const APPLY_PTO = Symbol('APPLY_PTO');
export const APPLIED_PTO = Symbol('APPLIED_PTO');

export function applyPTO(newPTO) {
    return {
        type: APPLY_PTO,
        newPTO
    };
};

export function appliedPTO() {
    return {
        type: APPLIED_PTO
    };
};
