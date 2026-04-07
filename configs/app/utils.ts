import { isBrowser } from 'toolkit/utils/isBrowser';
import * as regexp from 'toolkit/utils/regexp';

import {
  DEVNET_EXPLORER_API_HOST,
  DEVNET_EXPLORER_API_URL,
  MAINNET_EXPLORER_API_HOST,
  MAINNET_EXPLORER_API_URL,
  TESTNET_EXPLORER_API_HOST,
  TESTNET_EXPLORER_API_URL,
} from './fluent';

export const replaceQuotes = (value: string | undefined) => value?.replaceAll('\'', '"');

export const getEnvValue = (envName: string) => {
  let envs: Record<string, string | undefined> = {};

  if (isBrowser()) {

    const windowEnvs = (window as unknown as { __envs?: Record<string, string | undefined> }).__envs;
    envs = windowEnvs ?? {};

    if (envs.NEXT_PUBLIC_APP_INSTANCE === 'pw') {
      const storageValue = localStorage.getItem(envName);
      if (typeof storageValue === 'string') {
        return storageValue;
      }
    }
  } else {
    // eslint-disable-next-line no-restricted-properties
    envs = process.env as unknown as Record<string, string | undefined>;
  }

  return replaceQuotes(envs[envName]);
};

const getFluentApiConfig = () => {
  const apiHost = getEnvValue('NEXT_PUBLIC_EXPLORER_API_HOST');
  const apiUrl = getEnvValue('NEXT_PUBLIC_EXPLORER_API_URL');

  if (apiHost || apiUrl) {
    return {
      host: apiHost || getUrlHost(apiUrl),
      url: apiUrl || (apiHost ? `https://${ apiHost }` : undefined),
    };
  }

  const env = getEnvValue('NEXT_PUBLIC_CHAIN');

  switch (env) {
    case 'devnet':
      return {
        host: DEVNET_EXPLORER_API_HOST,
        url: DEVNET_EXPLORER_API_URL,
      };
    case 'mainnet':
      return {
        host: MAINNET_EXPLORER_API_HOST,
        url: MAINNET_EXPLORER_API_URL,
      };
    default:
      return {
        host: TESTNET_EXPLORER_API_HOST,
        url: TESTNET_EXPLORER_API_URL,
      };
  }
};

function getUrlHost(url: string | undefined) {
  if (!url) {
    return;
  }

  try {
    return new URL(url).host;
  } catch (error) {
    return;
  }
}

export const getApiHost = () => {
  const value = getFluentApiConfig().host;

  return value;
};

export const getStatsApiHost = () => {
  const value = getFluentApiConfig().url;

  return value;
};

export const getVisualizeApiHost = () => {
  const value = getFluentApiConfig().url;

  return value + ':8081';
};

export const parseEnvJson = <DataType>(env: string | undefined): DataType | null => {
  try {
    return JSON.parse(env || 'null') as DataType | null;
  } catch (error) {
    return null;
  }
};

export const getExternalAssetFilePath = (envName: string) => {
  const parsedValue = getEnvValue(envName);

  if (!parsedValue) {
    return;
  }

  return buildExternalAssetFilePath(envName, parsedValue);
};

export const buildExternalAssetFilePath = (name: string, value: string) => {
  try {
    const fileName = name.replace(/^NEXT_PUBLIC_/, '').replace(/_URL$/, '').toLowerCase();

    const fileExtension = getAssetFileExtension(value);
    if (!fileExtension) {
      throw new Error('Cannot get file path');
    }
    return `/assets/configs/${ fileName }.${ fileExtension }`;
  } catch (error) {
    return;
  }
};

function getAssetFileExtension(value: string) {
  try {
    const url = new URL(value);
    return url.pathname.match(regexp.FILE_EXTENSION)?.[1];
  } catch (error) {
    return parseEnvJson(value) ? 'json' : undefined;
  }
}
