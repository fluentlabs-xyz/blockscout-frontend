import type { Config, CreateConnectorFn, Transport } from '@wagmi/core';
import type { Chain } from 'viem';

declare module '@wagmi/core' {
  interface Register {
    // Widen chain id types to number to avoid literal-only restrictions across the app.
    config: Config<readonly [Chain, ...Array<Chain>], Record<number, Transport>, ReadonlyArray<CreateConnectorFn>>;
  }
}
