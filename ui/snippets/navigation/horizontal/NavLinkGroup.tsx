/* eslint-disable react/jsx-no-bind */
import { HStack, chakra } from '@chakra-ui/react';
import React from 'react';

import type { NavGroupItem } from 'types/client/navigation';

import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';

import LightningLabel from '../LightningLabel';
import { checkRouteHighlight } from '../utils';
import NavLink from './NavLink';

interface Props {
  item: NavGroupItem;
  onMouseOver?: () => void;
  hideSublinks?: boolean;
  onMouseLeave?: () => void;
}

const NavLinkGroup = ({ item, onMouseOver, hideSublinks }: Props) => {
  const { open: isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const bgColor = item.isActive ? '' : '';
  const color = item.isActive ? '' : '';

  const isHighlighted = checkRouteHighlight(item.subItems);
  const hasGroups = item.subItems.some((subItem) => Array.isArray(subItem));
  const onGroupHover = () => {
    onMouseOver && onMouseOver();
    !hideSublinks && onOpen();
  };

  return (
    <PopoverRoot
      open={ isOpen && !hideSublinks }
      onOpenChange={ onOpenChange }
      positioning={{ placement: 'bottom' }}
    >
      <PopoverTrigger onMouseOver={ onGroupHover } onMouseLeave={ onClose }>
        <chakra.li
          listStyleType="none"
          display="flex"
          alignItems="center"
          px={ 6 }
          py={ 3 }
          fontSize="sm"
          lineHeight={ 1 }
          fontWeight={ 500 }
          cursor="pointer"
          color={ isOpen ? '' : color }
          _hover={{ color: 'black', bg: 'white' }}
          bgColor={ bgColor }
          borderRadius="base"
        >
          { item.text }
          { isHighlighted && <LightningLabel iconColor={ bgColor } position={{ lg: 'static' }} ml={{ lg: '2px' }}/> }
        </chakra.li>
      </PopoverTrigger>
      <PopoverContent w="fit-content">
        <PopoverBody p={ 4 } bg="">
          { hasGroups ? (
            <HStack alignItems="flex-start">
              { item.subItems.map((subItem, index) => {
                if (!Array.isArray(subItem)) {
                  return <NavLink noIcon key={ subItem.text } item={ subItem }/>;
                }

                return (
                  <chakra.ul key={ index } display="flex" flexDir="column" rowGap={ 1 }>
                    { subItem.map((navItem) => <NavLink noIcon key={ navItem.text } item={ navItem }/>) }
                  </chakra.ul>
                );
              }) }
            </HStack>
          ) : (
            <chakra.ul display="flex" flexDir="column" rowGap={ 1 }>
              { item.subItems.map((subItem) => {
                if (Array.isArray(subItem)) {
                  return null;
                }
                return <NavLink noIcon key={ subItem.text } item={ subItem }/>;
              }) }
            </chakra.ul>
          ) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(NavLinkGroup);
