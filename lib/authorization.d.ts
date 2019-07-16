import { ICryptoOptions, IEncodeOptions, IDecodeOptions } from './crypto';
import { Exception } from './exception';

interface IDic<T> {
  [s: string]: T;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  expire_at: number;
}
export interface ServerTokens {
  tokenKey: string;
  refreshKey: string;
  refreshExpire: number;
  tokens: Tokens;
}
export interface MakeTokensOptions {
  tokenTimeout?: number;
  refreshTimeout?: number;
}
export function makeTokens(uid: string, options?: MakeTokensOptions): ServerTokens;

export interface EncryptedQueryPack {
  credential: string;
  q: string;
}

export type ActionSignature<P = {}, D = {}> = (payload: P) => Promise<D>;

export type ActionType<A extends keyof AP, AP = IDic<any>> = AP[A] extends (
  payload: any
) => Promise<any>
  ? AP[A]
  : never;
export type ActionResponseDataType<A extends keyof AP, AP = IDic<any>> = ReturnType<
  ActionType<A, AP>
> extends Promise<infer D>
  ? D
  : never;
export type ActionPayloadType<A extends keyof AP, AP = IDic<any>> = ActionType<
  A,
  AP
> extends ActionSignature<infer P>
  ? P
  : never;

export interface ClientQuery<A extends keyof AP, AP = IDic<any>> {
  action: A;
  payload: ActionPayloadType<A, AP>;
}

export type ResponseStatus = 'success' | 'fail' | 'unexpect';
export interface QueryResult<A extends keyof AP, AP = IDic<any>> {
  status: ResponseStatus;
  exception?: Exception;
  data?: ActionResponseDataType<A, AP>;
}

export function makeEncryptedQuery<A extends keyof AP, AP = IDic<any>>(
  token: string,
  query: ClientQuery<A, AP>,
  options?: ICryptoOptions & IEncodeOptions
): EncryptedQueryPack;

export interface ExtractedCredential {
  token: string;
  key: string;
  timestamp: number;
}
export type ExtractCredentialOptions = IDecodeOptions & { expire?: number; join?: string };
export function extractCredential(
  credential: string,
  options?: ExtractCredentialOptions
): ExtractedCredential;

export type ExtractedQueryPack<A extends keyof AP, AP = IDic<any>> = ExtractedCredential & {
  query: ClientQuery<A, AP>;
};
export function extractQuery<A extends keyof AP, AP = IDic<any>>(
  credential: string,
  encryptedQuery: string,
  options?: ExtractCredentialOptions
): ExtractedQueryPack<A, AP>;

export interface OnlineUserPack<U> {
  user: U;
  tokens: Tokens;
}

export interface ExecuteQueryPayload<U, A extends keyof AP, AP = IDic<any>> {
  user: U;
  query: ClientQuery<A, AP>;
}
export type VerifyTokenPromiseType<U> = (token: string) => Promise<U>;
export type ExecuteQueryPromiseType<U, A extends keyof AP, AP = IDic<any>> = (
  payload: ExecuteQueryPayload<U, A, AP>
) => Promise<QueryResult<A, AP>>;
export type QueryResponse<U, A extends keyof AP, AP = IDic<any>> = {
  result: QueryResult<A, AP>;
} & ExecuteQueryPayload<U, A, AP>;
export function handleQuery<U, A extends keyof AP, AP = IDic<any>>(
  credential: string,
  encryptedQuery: string,
  verifyToken: VerifyTokenPromiseType<U>,
  executeQuery: ExecuteQueryPromiseType<U, A, AP>,
  options?: ExtractCredentialOptions
): Promise<QueryResponse<U, A, AP>>;

export type VerifyAndSaveRefreshTokenPromiseType = (
  refreshToken: string,
  refreshedTokens: ServerTokens
) => Promise<Tokens>;
export type GetUidByAccessTokenPromiseType = (accessToken: string) => Promise<string>;
export function refreshTokens(
  tokens: Tokens,
  getUidByAccessToken: GetUidByAccessTokenPromiseType,
  verifyAndSaveRefreshToken: VerifyAndSaveRefreshTokenPromiseType,
  options?: MakeTokensOptions
): Promise<Tokens>;

declare module 'phusis/authorization';
