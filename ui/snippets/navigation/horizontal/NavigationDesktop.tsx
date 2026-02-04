/* eslint-disable react/jsx-no-bind */
import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';

import type { NavItem } from 'types/client/navigation';

import config from 'configs/app';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import RewardsButton from 'ui/rewards/RewardsButton';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
// import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkLogo from 'ui/snippets/networkLogo/NetworkLogo';
import UserProfileDesktop from 'ui/snippets/user/profile/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

import RollupStageBadge from '../RollupStageBadge';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';

const NavigationDesktop = () => {
  const { open, onClose, onOpen } = useDisclosure();
  const { mainNavItems } = useNavItems();
  const [ subLinks, setSubLinks ] = useState<Array<NavItem> | Array<Array<NavItem>> | null>(null);
  const navBg = 'grey.10';
  const borderColor = 'rgba(255, 255, 255, 0.30)';

  const onMouseOver = (subItems: Array<NavItem> | Array<Array<NavItem>> | null) => {
    setSubLinks(subItems);
  };

  return (
    <Box display="flex">
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        alignItems="center"
        px={ 12 }
        py={ 2 }
        width="100%"
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
        m="0 auto"
      >
        <NetworkLogo isCollapsed={ false } w={{ lg: '100%' }} maxW="120px"/>
        <RollupStageBadge ml={ 3 }/>
        <PopoverRoot
          positioning={{ placement: 'bottom', sameWidth: true }}
          open={ open }
        >
          <PopoverTrigger onMouseLeave={ onClose }>
            <Box
              ml="auto"
              as="nav"
              p="4px"
              display="flex"
              background={ open && subLinks ? navBg : 'transparent' }
              border={ `1px solid ${ open && subLinks ? borderColor : 'transparent' }` }
              borderBottom="none"
              style={ open && subLinks ? {
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
              } : {} }
            >
              <HStack as="ul" gap="6px" alignItems="center" display="flex">
                { mainNavItems.map((item) => {
                  if (isGroupItem(item)) {
                    return (
                      <NavLinkGroup
                        hideSublinks
                        onMouseOver={ () => {
                          onMouseOver(item.subItems); onOpen();
                        } }
                        onMouseLeave={ onClose }
                        key={ item.text }
                        item={ item }
                      />
                    );
                  } else {
                    return (
                      <NavLink noIcon onMouseOver={ () => {
                        onMouseOver(null); onClose();
                      } } key={ item.text } isMainNav item={ item }/>
                    );
                  }
                }) }
              </HStack>
            </Box>
          </PopoverTrigger>
          { subLinks && (
            <PopoverContent
              maxW="100%" w="100%" top={{ lg: 0, xl: '-10px' }}
              border={ `1px solid ${ borderColor }` }
              borderTop="none"
              borderBottomLeftRadius="16px"
              borderBottomRightRadius="16px"
              borderTopLeftRadius="0px"
              borderTopRadius="0px"
              boxShadow="none"
              onMouseLeave={ () => {
                onClose(); onMouseOver(null);
              } }
              onMouseOver={ onOpen }
            >
              <PopoverBody
                p={ 1 }
              >
                <VStack alignItems="start" as="ul" w="100%">
                  { subLinks?.map((subItem, index) => Array.isArray(subItem) ? (
                    <Box
                      key={ index }
                      w="100%"
                      as="ul"
                      _notLast={{
                        mb: 2,
                        pb: 2,
                        borderBottomWidth: '1px',
                        borderColor: 'divider',
                      }}
                    >
                      { subItem.map(subSubItem => <NavLink key={ subSubItem.text } item={ subSubItem }/>) }
                    </Box>
                  ) : (
                    <NavLink
                      key={ subItem.text }
                      noIcon={ !('icon' in subItem && subItem.icon) && !('iconComponent' in subItem && subItem.iconComponent) }
                      item={ subItem }
                    />
                  ),
                  ) }
                </VStack>
              </PopoverBody>
            </PopoverContent>
          ) }
        </PopoverRoot>
        <Flex gap={ 2 }>
          { config.features.rewards.isEnabled && <RewardsButton size="sm"/> }
          {
            (config.features.account.isEnabled && <UserProfileDesktop buttonSize="sm"/>) ||
            (config.features.blockchainInteraction.isEnabled && <UserWalletDesktop buttonSize="sm"/>)
          }
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(NavigationDesktop);
