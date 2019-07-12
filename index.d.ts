// Type definitions for phusis@0.2.0
// Project: phusis
// Definitions by: lennon<http://www.imqx.com>

import * as moment from 'moment';

declare namespace phusis {

  // conversion
  export function parseJSON(str: string): Object;
  export function camelToHyphenate(name: string): string;
  export function hyphenateToCamel(name: string): string;
  export function underscoreToCamel(name: string): string;
  export function camelToUnderscore(name: string): string;
  export function hyphenateToUnderscore(name: string): string;
  export function underscoreToHyphenate(name: string): string;

  export function num2en(num: number): string;
  export function num2cn(num: number, f?: boolean): string;

  interface IToTreeOptions {
    id?: string,
    parent?: string
  }
  type TreeNode<T> = {
    [P in keyof T]: T[P];
  } & { children: [TreeNode<T>?] };
  export function list2Tree<T>(list: T[], options?: IToTreeOptions): Array<TreeNode<T>>;
  
  // crypto
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
    mixed?: (s: string) => string,
    isHex?: boolean
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

  // authorization
  export interface Tokens {
    access_token: string,
    refresh_token: string,
    expire_at: number
  }
  export interface ServerTokens {
    tokenKey: string,
    refreshKey: string,
    refreshExpire: number,
    tokens: Tokens
  }
  export interface MakeTokensOptions {
    tokenTimeout?: number,
    refreshTimeout?: number
  }
  export function makeTokens(uid: string, options?: MakeTokensOptions): ServerTokens;

  export interface EncryptedQueryPack {
    credential: string,
    q: string
  }
  export interface ClientQuery {
    action: string,
    payload?: any
  }
  export function makeEncryptedQuery(
    token: string, query: ClientQuery, options?: ICryptoOptions & IEncodeOptions
  ): EncryptedQueryPack

  export interface ExtractedCredential {
    token: string,
    key: string,
    timestamp: number
  }
  export type ExtractCredentialOptions =
    IDecodeOptions & { expire?: number, join?: string };
  export function extractCredential(
    credential: string, options?: ExtractCredentialOptions
  ): ExtractedCredential | null;

  export type ExtractedQueryPack =
    (ExtractedCredential & { query: ClientQuery });
  export function extractQuery(
    credential: string, encryptedQuery: string, options?: ExtractCredentialOptions
  ): ExtractedQueryPack | null;

  export interface OnlineUserPack<U> {
    user: U,
    tokens: Tokens
  }
  export interface UsernameAndPassword {
    username: string, password_md5: string
  }
  export type VerifyUserPromiseType<U> = (user: UsernameAndPassword) => Promise<U>;
  export type SaveTokensPromiseType = (uid: string, tokens: ServerTokens) => Promise<boolean>;
  export function signin<U>(
    user: UsernameAndPassword, verifyUser: VerifyUserPromiseType<U>,
    saveTokens: SaveTokensPromiseType, options?: { userIdField?: string }
  ): Promise<OnlineUserPack<U>>;

  export interface ExecuteQueryPayload<U> {
    user?: U, query?: ClientQuery
  }
  export type VerifyTokenPromiseType<U> = (token: string) => Promise<U>;
  export type ExecuteQueryPromiseType<U, R> = (payload: ExecuteQueryPayload<U>) => Promise<R>;
  export type QueryResponse<R, U> = { result: R } & ExecuteQueryPayload<U>;
  export function handleQuery<R, U>(
    credential: string, encryptedQuery: string, verifyToken: VerifyTokenPromiseType<U>,
    executeQuery: ExecuteQueryPromiseType<U, R>, options?: ExtractCredentialOptions
  ): Promise<QueryResponse<R, U>>;

  export type VerifyAndSaveRefreshTokenPromiseType =
    (refreshToken: string, refreshedTokens: ServerTokens) => Promise<Tokens>;
  export type GetUidByAccessTokenPromiseType = (accessToken: string) => Promise<string>;
  export function refreshTokens(
    tokens: Tokens, getUidByAccessToken: GetUidByAccessTokenPromiseType,
    verifyAndSaveRefreshToken: VerifyAndSaveRefreshTokenPromiseType, options?: MakeTokensOptions
  ): Promise<Tokens>;

  // factory
  export function genSerial(): string;
  export function genSerial(pre: string): string;
  export function genUUID(): string;
  export function genUUID(type: 'timestamp' | 'namespace' | 'random', param?: string): string;
  export function genId(): string;

  // system
  export function sleep(time: number): Promise<void>;

  // polyfill
  export interface Exception {
    message: string;
    code: number;
    innerError: Error | Exception | null;
    log(logger?: { error(): void }): void;
    stacktrace(pages?: number, logger?: { error(): void }): void;
    new(message?: string, code?: number, error?: Error | Exception): Exception;
  }
  export function caught(error: Error | Exception, message?: string, code?: number): Exception;
  export function caught(error: Error | Exception, code?: number): Exception;
  export function caught(message: string, code?: number): Exception;
  export function caught(code: number): Exception;
  
  export function setLogger(logger: { error(): void }): void;

}

export = phusis;

declare global {
  interface String {
    isCnNewID(): boolean
  }
  interface Date {
    getStamp(): number;
  }
  interface DateConstructor {
    getCurrentStamp(): number;
    moment(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, strict?: boolean): moment.Moment;
    moment(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean): moment.Moment;
  }

}

