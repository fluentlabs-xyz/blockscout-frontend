import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import UserWalletAutoConnectAlert from '../UserWalletAutoConnectAlert';

interface Props {
  address: string;
  domain?: string;
  isAutoConnectDisabled?: boolean;
  isReconnecting?: boolean;
  onDisconnect: () => void;
  onOpenWallet: () => void;
}

const UserWalletMenuContent = ({ isAutoConnectDisabled, address, domain, onDisconnect }: Props) => {

  return (
    <Box>
      { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }
      <Text fontSize="sm" fontWeight={ 600 } mb={ 1 }>My wallet</Text>
      <Text fontSize="sm" mb={ 5 } fontWeight={ 400 } color="text.secondary">
        Your wallet is used to interact with apps and contracts in the explorer.
      </Text>
      <Flex alignItems="center" columnGap={ 2 } justifyContent="space-between">
        <AddressEntity
          address={{ hash: address, ens_domain_name: domain }}
          truncation="dynamic"
          fontSize="sm"
          fontWeight={ 700 }
        />
      </Flex>
      <Button
        size="sm"
        width="full"
        color="white"
        borderColor="white"
        _hover={{
          color: 'cyan.200',
          borderColor: 'cyan.200',
        }}
        variant="outline"
        onClick={ onDisconnect }
        mt={ 6 }
      >
        Disconnect
      </Button>
    </Box>
  );
};

export default React.memo(UserWalletMenuContent);
