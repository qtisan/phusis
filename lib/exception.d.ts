export interface Exception {
  type: 'Exception';
  message: string;
  code: number;
  innerError: Error | Exception;
  time: Date;
  log(logger?: { error(): void }): void;
  stacktrace(pages?: number, logger?: { error(): void }): void;
  new (message?: string, code?: number, error?: Error | Exception): Exception;
}
export function caught(error: Error | Exception, message?: string, code?: number): Exception;
export function caught(error: Error | Exception, code?: number): Exception;
export function caught(message: string, code?: number): Exception;
export function caught(code: number): Exception;

export function setLogger(logger: { error(): void }): void;

export function isException(exception: any): boolean;
export function isError(error: any): boolean;

declare module 'phusis/exception';
