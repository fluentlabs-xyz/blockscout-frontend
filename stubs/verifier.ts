import type { VerifierBatch } from 'types/api/verifier';

export const VERIFIER_BATCH: VerifierBatch = {
  index: 273,
  status: {
    code: 1,
    name: 'Committed',
  },
  batch_root: '0x1111111111111111111111111111111111111111111111111111111111111111',
  from_block_hash: '0x2222222222222222222222222222222222222222222222222222222222222222',
  to_block_hash: '0x3333333333333333333333333333333333333333333333333333333333333333',
  start_block: 1697,
  end_block: 1711,
  block_count: 15,
  l1_event_block: 4053979,
  interval_resolved: true,
};
