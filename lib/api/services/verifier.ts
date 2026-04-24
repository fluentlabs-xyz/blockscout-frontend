import type { ApiResource } from '../types';
import type { VerifierBatchesResponse } from 'types/api/verifier';

export const VERIFIER_API_RESOURCES = {
  batches: {
    path: '/verifier/v1/batches',
    filterFields: [],
    paginated: true,
  },
} satisfies Record<string, ApiResource>;

export type VerifierApiResourceName = `verifier:${ keyof typeof VERIFIER_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type VerifierApiResourcePayload<R extends VerifierApiResourceName> =
R extends 'verifier:batches' ? VerifierBatchesResponse :
never;
/* eslint-enable @stylistic/indent */
