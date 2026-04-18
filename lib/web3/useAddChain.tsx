import React from 'react';
import type { AddEthereumChainParameter } from 'viem';

import config from 'configs/app';
import {
  DEVNET_EXPLORER_URL,
  FLUENT_DEVNET_CHAIN_ID,
  FLUENT_MAINNET_CHAIN_ID,
  FLUENT_TESTNET_CHAIN_ID,
  MAINNET_EXPLORER_URL,
  TESTNET_EXPLORER_URL,
} from 'configs/app/fluent';
import { useMultichainContext } from 'lib/contexts/multichain';
import { SECOND } from 'toolkit/utils/consts';

import useRewardsActivity from '../hooks/useRewardsActivity';
import useProvider from './useProvider';
import { getHexadecimalChainId } from './utils';

const FLUENT_NETWORK_ICON = 'https://cdn.fluent.xyz/favicon.svg';

function isFluentChain(chainConfig: typeof config) {
  return chainConfig.chain.name.toLowerCase().includes('fluent');
}

function getDefaultBlockExplorerUrl(chainConfig: typeof config) {
  const chainId = Number(chainConfig.chain.id);

  switch (chainId) {
    case FLUENT_DEVNET_CHAIN_ID:
      return DEVNET_EXPLORER_URL;
    case FLUENT_TESTNET_CHAIN_ID:
      return TESTNET_EXPLORER_URL;
    case FLUENT_MAINNET_CHAIN_ID:
      return MAINNET_EXPLORER_URL;
    default:
      return chainConfig.app.baseUrl;
  }
}

function getParams(chainConfig: typeof config): AddEthereumChainParameter {
  if (!chainConfig.chain.id) {
    throw new Error('Missing required chain config');
  }

  return {
    chainId: getHexadecimalChainId(Number(chainConfig.chain.id)),
    chainName: chainConfig.chain.name ?? '',
    nativeCurrency: {
      name: chainConfig.chain.currency.name ?? '',
      symbol: chainConfig.chain.currency.symbol ?? '',
      decimals: chainConfig.chain.currency.decimals ?? 18,
    },
    rpcUrls: chainConfig.chain.rpcUrls,
    blockExplorerUrls: [ getDefaultBlockExplorerUrl(chainConfig) ],
    iconUrls: isFluentChain(chainConfig) ? [ FLUENT_NETWORK_ICON ] : undefined,
  };
}

interface Params {
  chainConfig?: typeof config;
}

export default function useAddChain(params?: Params) {
  const { data: { wallet, provider } = {} } = useProvider();
  const { trackUsage } = useRewardsActivity();
  const multichainContext = useMultichainContext();

  const chainConfig = params?.chainConfig || multichainContext?.chain.app_config || config;

  return React.useCallback(async() => {
    if (!wallet || !provider) {
      throw new Error('Wallet or provider not found');
    }

    const start = Date.now();

    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [ getParams(chainConfig) ],
    });

    // if network is already added, the promise resolves immediately
    if (Date.now() - start > SECOND) {
      await trackUsage('add_network');
    }
  }, [ wallet, provider, chainConfig, trackUsage ]);
}
