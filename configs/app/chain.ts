import {
  DEVNET_RPC_URL,
  FLUENT_DEVNET_CHAIN_ID,
  DEVNET_NETWORK_NATIVE_CURRENCY,
} from '@fluent.xyz/sdk-core/config/devnet-config';
import {
  MAINNET_RPC_URL,
  FLUENT_MAINNET_CHAIN_ID,
  MAINNET_NETWORK_NATIVE_CURRENCY,
} from '@fluent.xyz/sdk-core/config/mainnet-config';
import {
  TESTNET_RPC_URL,
  FLUENT_TESTNET_CHAIN_ID,
  TESTNET_NETWORK_NATIVE_CURRENCY,
} from '@fluent.xyz/sdk-core/config/testnet-config';

import type { RollupType } from 'types/client/rollup';
import type { AdditionalTokenType } from 'types/client/token';
import type { NetworkVerificationType, NetworkVerificationTypeEnvs } from 'types/networks';

import { urlValidator } from 'toolkit/components/forms/validators/url';

import { getEnvValue, parseEnvJson } from './utils';

const rollupType = getEnvValue('NEXT_PUBLIC_ROLLUP_TYPE') as RollupType;

const verificationType: NetworkVerificationType = (() => {
  if (rollupType === 'arbitrum') {
    return 'posting';
  }
  if (rollupType === 'zkEvm') {
    return 'sequencing';
  }
  return getEnvValue('NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE') as NetworkVerificationTypeEnvs || 'mining';
})();

const additionalTokenTypes = parseEnvJson<Array<AdditionalTokenType>>(getEnvValue('NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES')) || [];

const rpcUrls = (() => {
  const env = getEnvValue('NEXT_PUBLIC_CHAIN');
  const customRpc = getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL');
  let defaultRpcUrl;

  switch (env) {
    case 'devnet':
      defaultRpcUrl = DEVNET_RPC_URL;
      break;
    case 'mainnet':
      defaultRpcUrl = MAINNET_RPC_URL;
      break;
    default:
      defaultRpcUrl = TESTNET_RPC_URL;
      break;
  }

  const value =
    customRpc || defaultRpcUrl;

  if (!value) {
    return [];
  }

  const parsed = parseEnvJson<Array<string>>(value);
  if (Array.isArray(parsed)) {
    return parsed.filter((url) => urlValidator(url));
  }

  return urlValidator(value) ? [ value ] : [];
})();

const getChain = () => {
  const env = getEnvValue('NEXT_PUBLIC_CHAIN');

  switch (env) {
    case 'mainnet':
      return {
        id: String(FLUENT_MAINNET_CHAIN_ID),
        name: 'Fluent',
        shortName: 'Fluent',
        currency: {
          name: MAINNET_NETWORK_NATIVE_CURRENCY.name,
          weiName: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME'),
          symbol: MAINNET_NETWORK_NATIVE_CURRENCY.symbol,
          decimals: MAINNET_NETWORK_NATIVE_CURRENCY.decimals,
        },
        secondaryCoin: {
          symbol: getEnvValue('NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL'),
        },
        hasMultipleGasCurrencies: false,
        tokenStandard: 'ERC',
        additionalTokenTypes,
        rpcUrls,
        isTestnet: false,
        verificationType,
      };
    case 'devnet':
      return {
        id: String(FLUENT_DEVNET_CHAIN_ID),
        name: 'Fluent Devnet',
        shortName: 'Fluent Devnet',
        currency: {
          name: DEVNET_NETWORK_NATIVE_CURRENCY.name,
          weiName: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME'),
          symbol: DEVNET_NETWORK_NATIVE_CURRENCY.symbol,
          decimals: DEVNET_NETWORK_NATIVE_CURRENCY.decimals,
        },
        secondaryCoin: {
          symbol: getEnvValue('NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL'),
        },
        hasMultipleGasCurrencies: false,
        tokenStandard: 'ERC',
        additionalTokenTypes,
        rpcUrls,
        isTestnet: true,
        verificationType,
      };
    case 'testnet':
      return {
        id: String(FLUENT_TESTNET_CHAIN_ID),
        name: 'Fluent Testnet',
        shortName: 'Fluent Testnet',
        currency: {
          name: TESTNET_NETWORK_NATIVE_CURRENCY.name,
          weiName: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME'),
          symbol: TESTNET_NETWORK_NATIVE_CURRENCY.symbol,
          decimals: TESTNET_NETWORK_NATIVE_CURRENCY.decimals,
        },
        secondaryCoin: {
          symbol: getEnvValue('NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL'),
        },
        hasMultipleGasCurrencies: false,
        tokenStandard: 'ERC',
        additionalTokenTypes,
        rpcUrls,
        isTestnet: true,
        verificationType,
      };
    default:
      return {
        id: String(FLUENT_DEVNET_CHAIN_ID),
        name: 'Fluent Devnet',
        shortName: 'Fluent Devnet',
        currency: {
          name: DEVNET_NETWORK_NATIVE_CURRENCY.name,
          weiName: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME'),
          symbol: DEVNET_NETWORK_NATIVE_CURRENCY.symbol,
          decimals: DEVNET_NETWORK_NATIVE_CURRENCY.decimals,
        },
        secondaryCoin: {
          symbol: getEnvValue('NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL'),
        },
        hasMultipleGasCurrencies: false,
        tokenStandard: 'ERC',
        additionalTokenTypes,
        rpcUrls,
        isTestnet: true,
        verificationType,
      };
  }
};

const chain = Object.freeze(getChain());

export default chain;
