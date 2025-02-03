import { type ChakraProps } from '@chakra-ui/react';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import * as Sentry from '@sentry/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import localFont from 'next/font/local';
import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import config from 'configs/app';
import useQueryClientConfig from 'lib/api/useQueryClientConfig';
import { AppContextProvider } from 'lib/contexts/app';
import { ChakraProvider } from 'lib/contexts/chakra';
import { MarketplaceContextProvider } from 'lib/contexts/marketplace';
import { RewardsContextProvider } from 'lib/contexts/rewards';
import { ScrollDirectionProvider } from 'lib/contexts/scrollDirection';
import { SettingsContextProvider } from 'lib/contexts/settings';
import { growthBook } from 'lib/growthbook/init';
import useLoadFeatures from 'lib/growthbook/useLoadFeatures';
import useNotifyOnNavigation from 'lib/hooks/useNotifyOnNavigation';
import { SocketProvider } from 'lib/socket/context';
import RewardsLoginModal from 'ui/rewards/login/RewardsLoginModal';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import AppErrorGlobalContainer from 'ui/shared/AppError/AppErrorGlobalContainer';
import GoogleAnalytics from 'ui/shared/GoogleAnalytics';
import Layout from 'ui/shared/layout/Layout';
import Web3ModalProvider from 'ui/shared/Web3ModalProvider';
import './global.css';
import 'lib/setLocale';
// import 'focus-visible/dist/focus-visible';

const Bossa = localFont({
  src: '../public/fonts/Bossa-Regular.otf',
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
}

const ERROR_SCREEN_STYLES: ChakraProps = {
  h: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: 'fit-content',
  maxW: '800px',
  margin: { base: '0 auto', lg: '0 auto' },
  p: { base: 4, lg: 0 },
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {

  useLoadFeatures();
  useNotifyOnNavigation();

  const queryClient = useQueryClientConfig();

  const handleError = React.useCallback((error: Error) => {
    Sentry.captureException(error);
  }, []);

  const getLayout = Component.getLayout ?? ((page) => <Layout>{ page }</Layout>);

  return (
    <div className={ Bossa.className }>
      <ChakraProvider>
        <AppErrorBoundary
          { ...ERROR_SCREEN_STYLES }
          onError={ handleError }
          Container={ AppErrorGlobalContainer }
        >
          <Web3ModalProvider>
            <AppContextProvider pageProps={ pageProps }>
              <QueryClientProvider client={ queryClient }>
                <GrowthBookProvider growthbook={ growthBook }>
                  <ScrollDirectionProvider>
                    <SocketProvider url={ `${ config.api.socket }${ config.api.basePath }/socket/v2` }>
                      <RewardsContextProvider>
                        <MarketplaceContextProvider>
                          <SettingsContextProvider>
                            { getLayout(<Component { ...pageProps }/>) }
                            { config.features.rewards.isEnabled && <RewardsLoginModal/> }
                          </SettingsContextProvider>
                        </MarketplaceContextProvider>
                      </RewardsContextProvider>
                    </SocketProvider>
                  </ScrollDirectionProvider>
                </GrowthBookProvider>
                <ReactQueryDevtools buttonPosition="bottom-left" position="left"/>
                <GoogleAnalytics/>
              </QueryClientProvider>
            </AppContextProvider>
          </Web3ModalProvider>
        </AppErrorBoundary>
      </ChakraProvider>
    </div>
  );
}

export default MyApp;
