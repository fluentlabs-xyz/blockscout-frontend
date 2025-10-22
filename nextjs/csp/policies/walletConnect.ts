import type CspDev from 'csp-dev';

import config from 'configs/app';

import { KEY_WORDS } from '../utils';

export function walletConnect(): CspDev.DirectiveDescriptor {
  if (!config.features.blockchainInteraction.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      '*.web3modal.com',
      '*.web3modal.org',
      '*.walletconnect.com',
      '*.walletconnect.org',
      'wss://relay.walletconnect.com',
      'wss://relay.walletconnect.org',
      'wss://www.walletlink.org',
      // Coinbase Wallet domains
      '*.coinbase.com',
      '*.wallet.coinbase.com',
      '*.app.coinbase.com',
    ],
    'script-src': [
      '*.web3modal.com',
      '*.web3modal.org',
      '*.walletconnect.com',
      '*.walletconnect.org',
      // Coinbase Wallet domains
      '*.coinbase.com',
      '*.wallet.coinbase.com',
      '*.app.coinbase.com',
    ],
    'frame-ancestors': [
      '*.walletconnect.org',
      '*.walletconnect.com',
      // Coinbase Wallet domains
      '*.coinbase.com',
      '*.wallet.coinbase.com',
      '*.app.coinbase.com',
    ],
    'img-src': [
      KEY_WORDS.BLOB,
      '*.walletconnect.com',
      '*.web3modal.com',
      '*.web3modal.org',
      // Coinbase Wallet domains
      '*.coinbase.com',
      '*.wallet.coinbase.com',
      '*.app.coinbase.com',
    ],
  };
}
