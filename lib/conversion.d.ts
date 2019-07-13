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
  id?: string;
  parent?: string;
}
type TreeNode<T> = {
  [P in keyof T]: T[P];
} & { children: [TreeNode<T>?] };
export function list2Tree<T>(list: T[], options?: IToTreeOptions): Array<TreeNode<T>>;

declare module 'phusis/conversion';
