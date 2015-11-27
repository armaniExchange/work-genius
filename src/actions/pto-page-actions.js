export const APPLY_PTO = Symbol('APPLY_PTO');

export function applyPTO(newPTO) {

    return {
        type: APPLY_PTO,
        newPTO
    };
}
