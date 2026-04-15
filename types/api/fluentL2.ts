import type { Block } from './block';
import type { Transaction } from './transaction';

export interface FluentL2BatchesResponse {
  items: Array<FluentL2TxnBatch>;
  next_page_params: {
    items_count: number;
    number: number;
  };
}

type FluentL2TxnBatchCommitmentTransaction = {
  block_number: number;
  hash: string;
  timestamp: string;
};

type FluentL2TxnBatchConfirmationTransaction = {
  block_number: number | null;
  hash: string | null;
  timestamp: string | null;
};

export type FluentL2TxnBatch = {
  number: number;
  commitment_transaction: FluentL2TxnBatchCommitmentTransaction;
  confirmation_transaction: FluentL2TxnBatchConfirmationTransaction;
  start_block_number: number;
  end_block_number: number;
  transactions_count: number | null;
  data_availability: {
    batch_data_container: 'in_blob4844' | 'in_calldata';
  };
};

export type FluentL2TxnBatchTxs = {
  items: Array<Transaction>;
  next_page_params: {
    batch_number: number;
    block_number: number;
    index: number;
    items_count: number;
  } | null;
};

export type FluentL2TxnBatchBlocks = {
  items: Array<Block>;
  next_page_params: {
    batch_number: number;
    block_number: number;
    items_count: number;
  } | null;
};

export type FluentL2MessagesResponse = {
  items: Array<FluentL2MessageItem>;
  next_page_params: {
    id: number;
    items_count: number;
  } | null;
};

export type FluentL2MessageItem = {
  id: number;
  origination_transaction_block_number: number;
  origination_transaction_hash: string;
  origination_timestamp: string;
  completion_transaction_hash: string | null;
  value: string;
};

export const FLUENT_L2_BLOCK_STATUSES = [
  'Confirmed by Sequencer' as const,
  'Committed' as const,
  'Finalized' as const,
];

export type FluentL2BlockStatus = typeof FLUENT_L2_BLOCK_STATUSES[number];
