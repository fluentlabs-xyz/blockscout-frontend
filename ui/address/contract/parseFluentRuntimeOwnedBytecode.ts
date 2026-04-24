const RUNTIME_OWNED_PREFIX = 'ef4400';
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
  const payload = normalized?.slice(RUNTIME_OWNED_PREFIX.length);

  if (!normalized || !normalized.startsWith(RUNTIME_OWNED_PREFIX) || !payload || payload.length < ADDRESS_HEX_LENGTH) {
    return null;
  }

  return {
    runtimeOwner: `0x${ payload.slice(0, ADDRESS_HEX_LENGTH) }`,
  };
}
