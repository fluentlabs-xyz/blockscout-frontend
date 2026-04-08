import './fonts.css';
import './index.css';
import '../nextjs/global.css';
import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import MockDate from 'mockdate';
import * as router from 'next/router';

const NEXT_ROUTER_MOCK = {
  query: {},
  pathname: '',
  push: () => Promise.resolve(),
  replace: () => Promise.resolve(),
};

beforeMount(async({ hooksConfig }: { hooksConfig?: { router: typeof router } }) => {
  // Before mount, redefine useRouter to return mock value from test.
  const nextRouterState = {
    ...NEXT_ROUTER_MOCK,
    ...hooksConfig?.router,
  };

  const setRouterMock = (router as Record<string, unknown>).__setRouterMock;
  if (typeof setRouterMock === 'function') {
    (setRouterMock as (value: typeof nextRouterState) => void)(nextRouterState);
  }

  // set current date
  MockDate.set('2022-11-11T12:00:00Z');
});

export {};
