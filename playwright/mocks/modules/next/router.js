const DEFAULT_ROUTER_MOCK = {
  query: {},
  pathname: '',
  push: () => Promise.resolve(),
  replace: () => Promise.resolve(),
};

let currentRouter = { ...DEFAULT_ROUTER_MOCK };

export function __setRouterMock(router) {
  currentRouter = {
    ...DEFAULT_ROUTER_MOCK,
    ...(router || {}),
  };
}

export function useRouter() {
  return currentRouter;
}

export default {
  useRouter,
};
