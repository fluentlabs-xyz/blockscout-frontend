import dynamic from 'next/dynamic';
import React from 'react';
import { WagmiProvider } from 'wagmi';

import wagmiConfig from 'lib/web3/wagmiConfig';

const Web3ModalProviderClient = dynamic(() => import('./Web3ModalProviderClient'), {
  ssr: false,
});

interface Props {
  children: React.ReactNode;
}

const Web3ModalProvider = ({ children }: Props) => {
  return (
    <WagmiProvider config={ wagmiConfig.config }>
      <Web3ModalProviderClient>
        { children }
      </Web3ModalProviderClient>
    </WagmiProvider>
  );
};

export default Web3ModalProvider;
