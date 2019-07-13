// crypto
export interface IKeyCodePair {
  key: string;
  code: string;
}
export type DecodedAsset = string | IKeyCodePair;
export interface ICryptoOptions {
  bit?: number;
  map?: string;
  join?: string;
}
export interface IEncodeOptions extends ICryptoOptions {
  cipher?: string;
  mixed?: (s: string) => string;
  isHex?: boolean;
}
export interface IDecodeOptions extends ICryptoOptions {
  remix?: (s: string) => string;
  isHex?: boolean;
}

export function encodeByMap(origin: string, options: IEncodeOptions): DecodedAsset;
export function decodeByMap(code: DecodedAsset, options: IDecodeOptions): string;

export function encrypt(origin: string): string;
export function decrypt(code: string): string;

export function md5(origin: string): string;

declare module 'phusis/crypto';
