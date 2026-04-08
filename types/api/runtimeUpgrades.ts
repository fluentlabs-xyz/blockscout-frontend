export interface RuntimeUpgradeVersion {
  genesis_hash: string | null;
  genesis_version: string | null;
  upgrades_count: number;
  latest_block_number?: number | null;
  code_hash?: string | null;
}

export interface RuntimeUpgradesResponse {
  items: Array<RuntimeUpgradeVersion>;
}

export interface RuntimeUpgrade {
  block_number: number | null;
  block_timestamp: string | null;
  code_hash: string | null;
  genesis_hash: string | null;
  genesis_version: string | null;
  log_index: number | null;
  target_address_hash: string | null;
  transaction_hash: string | null;
}

export interface RuntimeUpgradeDetailsResponse {
  items: Array<RuntimeUpgrade>;
  next_page_params: null;
}
