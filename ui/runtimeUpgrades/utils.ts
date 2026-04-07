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

export function getRuntimeUpgradeLogsApiUrl() {
  return buildUrl('general:address_logs', { hash: RUNTIME_UPGRADE_ADDRESS }, { topic: RUNTIME_UPGRADED_TOPIC }, true);
}
