import { ICryptoOptions, IEncodeOptions, IDecodeOptions } from './crypto';

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
export interface ClientQuery {
  action: string;
  payload: any;
}
export function makeEncryptedQuery(
  token: string,
  query: ClientQuery,
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

export type ExtractedQueryPack = ExtractedCredential & { query: ClientQuery };
export function extractQuery(
  credential: string,
  encryptedQuery: string,
  options?: ExtractCredentialOptions
): ExtractedQueryPack;

export interface OnlineUserPack<U> {
  user: U;
  tokens: Tokens;
}
export interface UsernameAndPassword {
  username: string;
  password_md5: string;
}
export type VerifyUserPromiseType<U> = (user: UsernameAndPassword) => Promise<U>;
export type SaveTokensPromiseType = (uid: string, tokens: ServerTokens) => Promise<boolean>;
export function signin<U>(
  user: UsernameAndPassword,
  verifyUser: VerifyUserPromiseType<U>,
  saveTokens: SaveTokensPromiseType,
  options?: { userIdField?: string }
): Promise<OnlineUserPack<U>>;

export interface ExecuteQueryPayload<U> {
  user: U;
  query: ClientQuery;
}
export type VerifyTokenPromiseType<U> = (token: string) => Promise<U>;
export type ExecuteQueryPromiseType<U, R> = (payload: ExecuteQueryPayload<U>) => Promise<R>;
export type QueryResponse<R, U> = { result: R } & ExecuteQueryPayload<U>;
export function handleQuery<R, U>(
  credential: string,
  encryptedQuery: string,
  verifyToken: VerifyTokenPromiseType<U>,
  executeQuery: ExecuteQueryPromiseType<U, R>,
  options?: ExtractCredentialOptions
): Promise<QueryResponse<R, U>>;

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
