import config from 'configs/app';
import type { Unit } from 'ui/shared/value/utils';

const weiName = config.chain.currency.weiName || 'wei';

export const currencyUnits: Record<Unit, string> = {
  wei: weiName,
  gwei: `G${ weiName }`,
  ether: config.chain.currency.symbol || 'ETH',
};
