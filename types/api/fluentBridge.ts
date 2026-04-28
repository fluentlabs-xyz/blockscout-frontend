export type FluentBridgeTransferType = 'deposit' | 'withdrawal';

export type FluentBridgeTransactionItem = {
  transfer_type: FluentBridgeTransferType | 'all' | string;
  direction: 'l1_to_l2' | 'l2_to_l1' | string;
  status: string;
  message_hash: string;
  sender: string;
  recipient: string;
  sender_gateway: string;
  receiver_gateway: string;
  asset_type: string;
  amount: string;
  token_name: string | null;
  token_symbol: string | null;
  token_decimals: number | null;
  l1_tx_hash: string | null;
  l2_tx_hash: string | null;
  sent_tx_hash: string | null;
  received_tx_hash: string | null;
  source_stream: string;
  target_stream: string;
  sent_block_number: number | null;
  received_block_number: number | null;
  l1_block_number: number | null;
  l2_block_number: number | null;
  batch_index: number | null;
  batch_status_code: number | null;
  batch_status_name: string | null;
  sent_at: string | null;
  received_at: string | null;
  successful_call: boolean | null;
  value: string | null;
  fee: string | null;
  chain_id: string | null;
  valid_until_block_number: string | null;
  nonce: string | null;
  data: string | null;
};

export type FluentBridgeTransactionsResponse = {
  items: Array<FluentBridgeTransactionItem>;
  limit: number;
  offset: number;
  has_more: boolean;
  next_offset: number | null;
};
