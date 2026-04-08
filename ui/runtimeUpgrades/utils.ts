import buildUrl from 'lib/api/buildUrl';

export const RUNTIME_UPGRADE_ADDRESS = '0x0000000000000000000000000000000000520010';

const SYSTEM_CONTRACT_TAGS_BY_ADDRESS: Record<string, string> = {
  '0x0000000000000000000000000000000000520001': 'System Contract: EVM Runtime',
  '0x0000000000000000000000000000000000520003': 'System Contract: SVM Runtime',
  '0x0000000000000000000000000000000000520005': 'System Contract: WebAuthn Verifier',
  '0x0000000000000000000000000000000000520006': 'System Contract: OAuth2 Verifier',
  '0x0000000000000000000000000000000000520007': 'System Contract: Nitro Verifier',
  '0x0000000000000000000000000000000000520008': 'System Contract: Universal Token Runtime',
  '0x0000000000000000000000000000000000520009': 'System Contract: Wasm Runtime',
  '0x0000000000000000000000000000000000520010': 'System Contract: Runtime Upgrade',
  '0x9cacf613fc29015893728563f423fd26dcdb8ddc': 'System Contract: Rollup Bridge',
  '0x0000000000000000000000000000000000520fee': 'System Contract: Fee Manager',
};

export function getSystemContractTag(address: string | null | undefined) {
  if (!address) {
    return null;
  }

  return SYSTEM_CONTRACT_TAGS_BY_ADDRESS[address.toLowerCase()] || null;
}

export function getRuntimeUpgradesApiUrl() {
  return buildUrl('general:runtime_upgrades', undefined, undefined, true);
}
