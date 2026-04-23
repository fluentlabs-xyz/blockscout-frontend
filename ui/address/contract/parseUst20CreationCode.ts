const UST20_MAGIC_BYTES = '45524320';
const UST20_WORD_HEX_LENGTH = 64;
const UST20_ADDRESS_HEX_LENGTH = 40;

export interface ParsedUst20CreationCodeArg {
  id: 'token_name' | 'token_symbol' | 'decimals' | 'initial_supply' | 'minter' | 'pauser' | 'wrapped';
  label: string;
  type: 'string' | 'number' | 'address';
  value: string;
}

function normalizeHex(value: string): string | null {
  const normalized = value.startsWith('0x') ? value.slice(2) : value;

  if (!normalized || normalized.length % 2 !== 0 || /[^a-f\d]/i.test(normalized)) {
    return null;
  }

  return normalized.toLowerCase();
}

function getWord(payload: string, index: number): string | null {
  const start = index * UST20_WORD_HEX_LENGTH;
  const end = start + UST20_WORD_HEX_LENGTH;

  if (payload.length < end) {
    return null;
  }

  return payload.slice(start, end);
}

function decodeBytes32Text(word: string): string | null {
  const chunks = word.match(/.{1,2}/g);

  if (!chunks) {
    return null;
  }

  const bytes = Uint8Array.from(chunks.map((chunk) => Number.parseInt(chunk, 16)));
  const zeroIndex = bytes.indexOf(0);
  const textBytes = zeroIndex >= 0 ? bytes.slice(0, zeroIndex) : bytes;

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(textBytes);
  } catch {
    return null;
  }
}

function decodeNumber(word: string): string {
  return BigInt(`0x${ word }`).toString();
}

function decodeAddress(word: string): string {
  return `0x${ word.slice(-UST20_ADDRESS_HEX_LENGTH) }`;
}

export default function parseUst20CreationCode(value: string): Array<ParsedUst20CreationCodeArg> | null {
  const normalized = normalizeHex(value);

  if (!normalized || !normalized.startsWith(UST20_MAGIC_BYTES)) {
    return null;
  }

  const payload = normalized.slice(UST20_MAGIC_BYTES.length);
  const parsed: Array<ParsedUst20CreationCodeArg> = [];

  const tokenNameWord = getWord(payload, 0);
  if (tokenNameWord) {
    const tokenName = decodeBytes32Text(tokenNameWord);
    if (tokenName !== null) {
      parsed.push({ id: 'token_name', label: 'Token name', type: 'string', value: tokenName });
    }
  }

  const tokenSymbolWord = getWord(payload, 1);
  if (tokenSymbolWord) {
    const tokenSymbol = decodeBytes32Text(tokenSymbolWord);
    if (tokenSymbol !== null) {
      parsed.push({ id: 'token_symbol', label: 'Token symbol', type: 'string', value: tokenSymbol });
    }
  }

  const decimalsWord = getWord(payload, 2);
  if (decimalsWord) {
    parsed.push({ id: 'decimals', label: 'Decimals', type: 'number', value: decodeNumber(decimalsWord) });
  }

  const initialSupplyWord = getWord(payload, 3);
  if (initialSupplyWord) {
    parsed.push({ id: 'initial_supply', label: 'Initial supply', type: 'number', value: decodeNumber(initialSupplyWord) });
  }

  const minterWord = getWord(payload, 4);
  if (minterWord) {
    parsed.push({ id: 'minter', label: 'Minter', type: 'address', value: decodeAddress(minterWord) });
  }

  const pauserWord = getWord(payload, 5);
  if (pauserWord) {
    parsed.push({ id: 'pauser', label: 'Pauser', type: 'address', value: decodeAddress(pauserWord) });
  }

  const wrappedWord = getWord(payload, 6);
  if (wrappedWord) {
    parsed.push({ id: 'wrapped', label: 'Wrapped', type: 'number', value: decodeNumber(wrappedWord) });
  }

  return parsed.length > 0 ? parsed : null;
}
