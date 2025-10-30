import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';

import { CONTENT_MAX_WIDTH } from '../utils';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const MainColumn = ({ children, className }: Props) => {
  return (
    <Flex
      className={ className }
      flexDir="column"
      flexGrow={ 1 }
      w={{ base: '100%', lg: config.UI.navigation.layout === 'horizontal' ? '100%' : 'auto' }}
      paddingX={{ base: 3, lg: config.UI.navigation.layout === 'horizontal' ? 12 : 12 }}
      paddingRight={{ '2xl': 6 }}
      paddingTop={{ base: `${ 12 + 52 }px`, lg: 6 }} // 12px is top padding of content area, 52px is search bar height
      paddingBottom={ 8 }
      maxW={ `${ CONTENT_MAX_WIDTH }px` }
      m="0 auto"
    >
      { children }
    </Flex>
  );
};

export default React.memo(chakra(MainColumn));
