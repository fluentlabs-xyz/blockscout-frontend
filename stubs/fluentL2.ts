import type { FluentL2MessageItem, FluentL2TxnBatch } from 'types/api/fluentL2';

import { TX_HASH } from './tx';

export const FLUENT_L2_TXN_BATCH: FluentL2TxnBatch = {
  commitment_transaction: {
    block_number: 4053979,
    hash: '0xd04d626495ef69abd37ae3ea585ed03319a3d3b50cf10874f7f36741c7b45a18',
    timestamp: '2023-08-09T08:09:12.000000Z',
  },
  confirmation_transaction: {
    block_number: null,
    hash: null,
    timestamp: null,
  },
  end_block_number: 1711,
  number: 273,
  start_block_number: 1697,
  transactions_count: 15,
  data_availability: {
    batch_data_container: 'in_blob4844',
  },
};

export const FLUENT_L2_MESSAGE_ITEM: FluentL2MessageItem = {
  id: 930795,
  origination_transaction_block_number: 20639178,
  origination_transaction_hash: TX_HASH,
  origination_timestamp: '2024-08-30T05:03:23.000000Z',
  completion_transaction_hash: 'TX_HASH',
  value: '5084131319054877748',
};
