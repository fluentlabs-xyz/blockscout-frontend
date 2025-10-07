import { Flex, Separator, Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';

import DeFiDropdown from './DeFiDropdown';
import NetworkMenu from './NetworkMenu';
import TopBarStats from './TopBarStats';

const TopBar = () => {
  return (
    // not ideal if scrollbar is visible, but better than having a horizontal scroll
    <Box bgColor={{ _light: 'transparent', _dark: 'transparent' }} position="sticky" left={ 0 } width="100%" maxWidth="100vw">
      <Flex
        py={ 2 }
        px={{ base: '34px', lg: '34px' }}
        m="0 auto"
        justifyContent="space-between"
        alignItems="center"
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
      >
        { !config.features.opSuperchain.isEnabled ? <TopBarStats/> : <div/> }
        <Flex alignItems="center">
          { config.features.deFiDropdown.isEnabled && (
            <>
              <DeFiDropdown/>
              <Separator mr={ 3 } ml={{ base: 2, sm: 3 }} height={ 4 } orientation="vertical"/>
            </>
          ) }
          { Boolean(config.UI.featuredNetworks.items) && (
            <>
              <Separator mx={ 3 } height={ 4 } orientation="vertical"/>
              <NetworkMenu/>
            </>
          ) }
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(TopBar);
