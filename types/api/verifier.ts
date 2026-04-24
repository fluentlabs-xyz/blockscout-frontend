export type VerifierBatchStatus = {
  code: number;
  name: string;
};

export type VerifierBatch = {
  index: number;
  status: VerifierBatchStatus;
  batch_root: string;
  from_block_hash: string;
  to_block_hash: string;
  start_block: number;
  end_block: number;
  block_count: number;
  l1_event_block: number;
  interval_resolved: boolean;
};

export type VerifierBatchesResponseRaw = {
  items: Array<VerifierBatch>;
  limit: number;
  has_more: boolean;
  next_cursor?: number | null;
};

export type VerifierBatchesResponse = VerifierBatchesResponseRaw & {
  next_page_params: {
    cursor: number;
    limit: number;
  } | null;
};
