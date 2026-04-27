import { getEnvValue } from './utils';

export default Object.freeze({
  fluentBridgeTransactionsApi: getEnvValue('NEXT_PUBLIC_FLUENT_BRIDGE_TRANSACTIONS_API_URL') || 'https://api.gblend.xyz/indexer/v1/transactions',
  reCaptchaV2: {
    siteKey: getEnvValue('NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY'),
  },
});
