import { decodeAbiParameters, getAddress, slice } from 'viem';

import type { Log } from 'types/api/log';

import buildUrl from 'lib/api/buildUrl';

export const RUNTIME_UPGRADE_ADDRESS = '0x0000000000000000000000000000000000520010';
export const RUNTIME_UPGRADED_TOPIC = '0x2b9d873d8fe3cc1332bb875ae358b40fd305d1776ebe63cc80bac10fd3cf057b';

const HASH_32_REGEX = /^0x[0-9a-fA-F]{64}$/;

const runtimeUpgradedDataAbi = [
  {
    name: 'upgrade',
    type: 'tuple',
    components: [
      { name: 'genesis_version', type: 'string' },
      { name: 'code_hash', type: 'bytes32' },
    ],
  },
] as const;

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

export interface RuntimeUpgradeDecoded {
  targetAddress: string | null;
  genesisHash: string | null;
  genesisVersion: string | null;
  codeHash: string | null;
  isDecoded: boolean;
}

export function decodeRuntimeUpgradedLog(log: Log): RuntimeUpgradeDecoded {
  let targetAddress: string | null = null;
  let genesisHash: string | null = null;
  let genesisVersion: string | null = null;
  let codeHash: string | null = null;

  const targetAddressTopic = log.topics[1];
  if (targetAddressTopic && HASH_32_REGEX.test(targetAddressTopic)) {
    try {
      targetAddress = getAddress(slice(targetAddressTopic as `0x${ string }`, 12));
    } catch {
      targetAddress = null;
    }
  }

  const genesisHashTopic = log.topics[2];
  if (genesisHashTopic && HASH_32_REGEX.test(genesisHashTopic)) {
    genesisHash = genesisHashTopic;
  }

  if (typeof log.data === 'string' && log.data.startsWith('0x')) {
    try {
      const [ decodedUpgrade ] = decodeAbiParameters(runtimeUpgradedDataAbi, log.data as `0x${ string }`);
      genesisVersion = decodedUpgrade.genesis_version;
      codeHash = decodedUpgrade.code_hash;
    } catch {
      genesisVersion = null;
      codeHash = null;
    }
  }

  return {
    targetAddress,
    genesisHash,
    genesisVersion,
    codeHash,
    isDecoded: Boolean(targetAddress && genesisHash && genesisVersion !== null && codeHash),
  };
}

export function getSystemContractTag(address: string | null | undefined) {
  if (!address) {
    return null;
  }

  return SYSTEM_CONTRACT_TAGS_BY_ADDRESS[address.toLowerCase()] || null;
}

export function getRuntimeUpgradeLogsApiUrl() {
  return buildUrl('general:address_logs', { hash: RUNTIME_UPGRADE_ADDRESS }, { topic: RUNTIME_UPGRADED_TOPIC }, true);
}
