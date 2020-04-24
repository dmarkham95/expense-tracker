export interface IDictionaryCollection<T> {
    Add(key: string, value: T): void;
    ContainsKey(key: string): boolean;
    Count(): number;
    Item(key: string): T;
    Keys(): Array<string>;
    Remove(key: string): T;
    Values(): Array<T>;
}