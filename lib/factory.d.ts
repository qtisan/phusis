export function genSerial(): string;
export function genSerial(pre: string): string;
export function genUUID(): string;
export function genUUID(type: 'timestamp' | 'namespace' | 'random', param?: string): string;
export function genId(): string;

declare module 'phusis/factory';
