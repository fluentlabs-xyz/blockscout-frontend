import type { GridProps, HTMLChakraProps } from '@chakra-ui/react';
import { Box, Grid, Flex, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';

import NetworkLogo from '../networkLogo/NetworkLogo';
import FooterLinkItem from './FooterLinkItem';

const MAX_LINKS_COLUMNS = 4;

const BLOCKSCOUT_LINKS = [
  {
    icon: 'social/git' as const,
    iconSize: '20px',
    text: 'GitHub',
    url: 'https://github.com/fluentlabs-xyz',
  },
  {
    icon: 'social/twitter' as const,
    iconSize: '18px',
    text: 'X (ex-Twitter)',
    url: 'https://twitter.com/fluentxyz',
  },
  {
    icon: 'social/discord' as const,
    iconSize: '24px',
    text: 'Discord',
    url: 'https://discord.com/invite/fluentxyz',
  },
];

const Footer = () => {
  const logoColor = useColorModeValue('blue.600', 'white');

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>({
    queryKey: [ 'footer-links' ],
    queryFn: async() => fetch(config.UI.footer.links || '', undefined, { resource: 'footer-links' }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ? 1 : Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  const renderBlockscoutInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
    return (
      <Box gridArea={ gridArea }>
        <Flex columnGap={ 2 } fontSize="xs" lineHeight={ 5 } alignItems="center" color="text">
          <Text display="flex" alignItems="center" h="32px">
            Made with
          </Text>
          <Link noIcon href="https://www.blockscout.com" external display="inline-flex" color={ logoColor } _hover={{ color: 'cyan.200' }}>
            <IconSvg
              name="networks/logo-placeholder"
              width="80px"
              height="32px"
            />
          </Link>
          <Text display="flex" alignItems="center" h="32px">
            (GPLv3).
          </Text>
        </Flex>
        <Box mt={ 2 } alignItems="start" fontSize="xs" lineHeight={ 5 }>
          <Flex columnGap={ 2 } fontSize="xs" lineHeight={ 5 } alignItems="center" color="text">
            <Text display="flex" alignItems="center" h="32px">
              Based on blockscout/frontend
            </Text>
            <Link
              noIcon
              external
              href="https://github.com/fluentlabs-xyz/blockscout-frontend"
              height="32px"
              display="inline-flex"
              color={ logoColor }
              _hover={{ color: 'cyan.200' }}
            >
              modified by Fluent Labs.
            </Link>
          </Flex>
          <Text height="32px">
            Copyright © Blockscout Limited 2023-{ (new Date()).getFullYear() }
          </Text>
        </Box>
      </Box>
    );
  }, [ logoColor ]);

  const containerProps: HTMLChakraProps<'div'> = {
    as: 'footer',
    borderTopWidth: '1px',
    borderTopColor: 'border.divider',
  };

  const contentProps: GridProps = {
    px: { base: 4, lg: config.UI.navigation.layout === 'horizontal' ? 6 : 12, '2xl': 6 },
    py: { base: 4, lg: 8 },
  };

  if (config.UI.footer.links) {
    return (
      <Box { ...containerProps }>
        <Grid { ...contentProps }>
          <div>
            { renderBlockscoutInfo() }
          </div>
          <Grid
            gap={{ base: 6, lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8, xl: 12 }}
            gridTemplateColumns={{
              base: 'repeat(auto-fill, 160px)',
              lg: `repeat(${ colNum }, 135px)`,
              xl: `repeat(${ colNum }, 160px)`,
            }}
            justifyContent={{ lg: 'flex-end' }}
            mt={{ base: 8, lg: 0 }}
          >
            {
              ([
                { title: 'Blockscout', links: BLOCKSCOUT_LINKS },
                ...(linksData || []),
              ])
                .slice(0, colNum)
                .map(linkGroup => (
                  <Box key={ linkGroup.title }>
                    <Skeleton fontWeight={ 500 } mb={ 3 } display="inline-block" loading={ !isPlaceholderData }>{ linkGroup.title }</Skeleton>
                    <VStack alignItems="start" flexDirection={{ lg: 'row', sm: 'column' }} gap={ 1 }>
                      { linkGroup.links.map(link => <FooterLinkItem { ...link } key={ link.text } isLoading={ isPlaceholderData }/>) }
                    </VStack>
                  </Box>
                ))
            }
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={ 2 } px={ 12 }>
      <Box
        { ...containerProps }
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <NetworkLogo/>

        <Box
          { ...contentProps }
          display="flex"
          justifyContent="flex-end"
        >
          <Grid
            display="flex"
            alignContent="start"
            justifyContent={{ lg: 'flex-end' }}
            gap={ 8 }
            mt={{ base: 8, lg: 0 }}
            flexDirection={{ lg: 'row', sm: 'column' }}
          >
            { BLOCKSCOUT_LINKS.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }
          </Grid>
        </Box>
      </Box>
      { renderBlockscoutInfo() }
    </Box>
  );
};

export default React.memo(Footer);
