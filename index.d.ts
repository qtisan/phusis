// Type definitions for phusis@0.2.0
// Project: phusis
// Definitions by: lennon<http://www.imqx.com>

declare namespace utilities {

  export function parseJSON(str: string): Object;
  export function camelToHyphenate(name: string): string;
  export function hyphenateToCamel(name: string): string;
  export function underscoreToCamel(name: string): string;
  export function camelToUnderscore(name: string): string;
  export function hyphenateToUnderscore(name: string): string;
  export function underscoreToHyphenate(name: string): string;

  export function num2en(num: number): string;
  export function num2cn(num: number, f?: boolean): string;

  export interface IKeyCodePair {
    key: string,
    code: string
  }
  export type DecodedAsset = string | IKeyCodePair;
  export interface ICryptoOptions {
    bit?: number,
    map?: string,
    join?: string
  }
  export interface IEncodeOptions extends ICryptoOptions {
    cipher?: string,
    mixed?: (s: string) => string
  }
  export interface IDecodeOptions extends ICryptoOptions {
    remix?: (s: string) => string,
    isHex?: boolean
  }

  export function encodeByMap(origin: string, options: IEncodeOptions): DecodedAsset;
  export function decodeByMap(code: DecodedAsset, options: IDecodeOptions): string;

  export function encrypt(origin: string): string;
  export function decrypt(code: string): string;
  
  export function md5(origin: string): string;

  export function genSerial(pre?: string): string;

}

declare global {
  interface String {
    isCnNewID(): boolean
  }
  interface IToTreeOptions {
    id?: string,
    parent?: string
  }
  type TreeNode<T> = {
    [P in keyof T]: T[P];
  } & { children: [TreeNode<T>?] };
  interface Array<T> {
    toTree(options?: IToTreeOptions): Array<TreeNode<T>>,
  }
  interface Date {
    getStamp(): number;
  }
  type CustomerError = Error & {
    code: number,
    type: string,
    innerError: Error | CustomerError
  };
  interface Error {
    wrap(errorMessage: string): CustomerError,
    wrap(err: { message: string, code?: number, type?: string, name?: string }): CustomerError,
    log(logger?: { error(): void }): void
  }
}

export = utilities;
