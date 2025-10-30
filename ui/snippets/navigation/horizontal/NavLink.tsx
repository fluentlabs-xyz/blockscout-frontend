import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import type { NavItem } from 'types/client/navigation';

import { route } from 'nextjs-routes';

import { isInternalItem } from 'lib/hooks/useNavItems';
import { Link } from 'toolkit/chakra/link';

import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import { checkRouteHighlight } from '../utils';

interface Props {
  className?: string;
  item: NavItem;
  isMainNav?: boolean;
  noIcon?: boolean;
  onMouseOver?: () => void;
}

const NavLink = ({ className, item, noIcon, onMouseOver, isMainNav }: Props) => {
  const isInternalLink = isInternalItem(item);

  const isActive = 'isActive' in item && item.isActive;

  const isHighlighted = checkRouteHighlight(item);

  return (
    <chakra.li
      listStyleType="none"
      onMouseOver={ onMouseOver }
      w={ !isMainNav ? '100%' : '' }
    >
      <Link
        className={ className }
        href={ isInternalLink ? route(item.nextRoute) : item.url }
        external={ !isInternalLink }
        display="flex"
        alignItems="center"
        variant="navigation"
        { ...(isActive ? { 'data-selected': true } : {}) }
        px={ !isMainNav ? '12px' : '24px' }
        py={ !isMainNav ? '12px' : '12px' }
        w={ !isMainNav ? '100%' : '' }
        textStyle="sm"
        fontWeight={ 500 }
        borderRadius="base"
        _hover={{
          bg: 'grey.20',
          borderRadius: '14px',
          color: 'white',
        }}
      >
        { !noIcon && (
          <Box w={{ base: '36px', lg: '36px' }} display="flex" borderRadius="10px" bg="black" p="6px">
            <NavLinkIcon boxSize="24px" item={ item } color="rgba(255, 255, 255, 0.5)"/>
          </Box>
        ) }
        <chakra.span>{ item.text }</chakra.span>
        { isHighlighted && (
          <LightningLabel
            iconColor={ isActive ? 'link.navigation.bg.selected' : 'link.navigation.bg.group' }
            position={{ lg: 'static' }}
            ml={{ lg: '2px' }}
            isCollapsed={ false }
          />
        ) }
      </Link>
    </chakra.li>
  );
};

export default React.memo(chakra(NavLink));
