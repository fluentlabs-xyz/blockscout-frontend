import type { EntityTag } from './types';
import type { AddressTag } from 'types/api/addressParams';

export const CUSTOM_TAG_META = {
  bgColor: 'linear-gradient(90deg, #FE6901 -7.32%, #FF7FFE 81.62%)',
  textColor: 'black',
};

const COLORED_PUBLIC_TAGS = [
  'sys_evm_runtime',
  'sys_svm_runtime',
  'sys_webauthn_verifier',
  'sys_oauth2_verifier',
  'sys_nitro_verifier',
  'sys_universal_token_runtime',
  'sys_wasm_runtime',
  'sys_runtime_upgrade',
  'sys_rollup_bridge',
  'sys_fee_manager',
];

const COLORED_PUBLIC_TAGS_TITLE = [
  'evm runtime',
  'svm runtime',
  'webauthn verifier',
  'oauth2 verifier',
  'nitro verifier',
  'universal token runtime',
  'wasm runtime',
  'runtime upgrade',
  'rollup bridge',
  'fee manager',
];

function isColoredPublicTag(tag: AddressTag): boolean {
  const label = tag.label.toLowerCase();
  const displayName = tag.display_name.toLowerCase();

  return COLORED_PUBLIC_TAGS.some((coloredTag) => label.includes(coloredTag)) ||
    COLORED_PUBLIC_TAGS_TITLE.some((coloredTitle) => displayName.includes(coloredTitle));
}

export default function formatPublicTags(tags: Array<AddressTag> | null | undefined, getMeta?: (tag: AddressTag) => EntityTag['meta']): Array<EntityTag> {
  return (tags || []).map((tag) => ({
    slug: tag.label,
    name: tag.display_name,
    tagType: 'custom' as const,
    ordinal: -1,
    meta: {
      ...(isColoredPublicTag(tag) ? CUSTOM_TAG_META : {}),
      ...(getMeta?.(tag) ?? {}),
    },
  }));
}
