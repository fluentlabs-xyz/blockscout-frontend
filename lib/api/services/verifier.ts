import type { ApiResource } from '../types';
import type { FluentBridgeTransactionsResponse } from 'types/api/fluentBridge';
import type { VerifierBatchesResponse } from 'types/api/verifier';

export const VERIFIER_API_RESOURCES = {
  batches: {
    path: '/verifier/v1/batches',
    filterFields: [],
    paginated: true,
  },
  bridge_transactions: {
    path: '/indexer/v1/transactions',
    filterFields: [ 'transfer_type' as const ],
  },
} satisfies Record<string, ApiResource>;

export type VerifierApiResourceName = `verifier:${ keyof typeof VERIFIER_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type VerifierApiResourcePayload<R extends VerifierApiResourceName> =
R extends 'verifier:batches' ? VerifierBatchesResponse :
R extends 'verifier:bridge_transactions' ? FluentBridgeTransactionsResponse :
never;
/* eslint-enable @stylistic/indent */
