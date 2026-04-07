const RUNTIME_OWNED_PREFIX = 'ef44';
const ADDRESS_HEX_LENGTH = 40;

function normalizeHex(value: string): string | null {
  const normalized = value.startsWith('0x') ? value.slice(2) : value;

  if (!normalized || normalized.length % 2 !== 0 || /[^a-f\d]/i.test(normalized)) {
    return null;
  }

  return normalized.toLowerCase();
}

export interface ParsedFluentRuntimeOwnedBytecode {
  runtimeOwner: string;
}

export default function parseFluentRuntimeOwnedBytecode(value: string): ParsedFluentRuntimeOwnedBytecode | null {
  const normalized = normalizeHex(value);

  if (!normalized || !normalized.startsWith(RUNTIME_OWNED_PREFIX) || normalized.length < ADDRESS_HEX_LENGTH) {
    return null;
  }

  return {
    runtimeOwner: `0x${ normalized.slice(-ADDRESS_HEX_LENGTH) }`,
  };
}
