import { Flex, Separator, Box, HStack } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';

import DeFiDropdown from './DeFiDropdown';
import NetworkMenu from './NetworkMenu';
import TopBarStats from './TopBarStats';

const TopBar = () => {
  const hasDeFiDropdown = Boolean(config.features.deFiDropdown.isEnabled);

  return (
    // not ideal if scrollbar is visible, but better than having a horizontal scroll
    <Box bgColor={{ _light: 'transparent', _dark: 'black' }} position="sticky" left={ 0 } width="100%" maxWidth="100vw">
      <Flex
        py={ 2 }
        px={{ base: '34px', lg: 12 }}
        m="0 auto"
        justifyContent="space-between"
        alignItems="center"
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
      >
        <HStack gap={ 0 } fontSize="xs">
          { Boolean(config.UI.featuredNetworks.items || config.features.multichain.isEnabled) && <NetworkMenu/> }
          { !config.features.multichain.isEnabled ? <TopBarStats/> : <div/> }
        </HStack>
        <HStack
          alignItems="center"
          separator={ <Separator mx={{ base: 2, lg: 3 }} height={ 4 }/> }
        >
          { hasDeFiDropdown && (
            <HStack>
              { hasDeFiDropdown && <DeFiDropdown/> }
            </HStack>
          ) }
        </HStack>
      </Flex>
    </Box>
  );
};

export default React.memo(TopBar);
