import { IDictionaryCollection } from './Interfaces/IDictionary';

export class Dictionary<T> implements IDictionaryCollection<T> {
  private items: { [index: string]: T } = {};

  private count: number = 0;

  public ContainsKey(key: string): boolean {
    return this.items.hasOwnProperty(key);
  }

  public Count(): number {
    return this.count;
  }

  public Add(key: string, value: T): void {
    if (!this.items.hasOwnProperty(key)) {
      this.count++;
    }

    this.items[key] = value;
  }

  public Remove(key: string): T {
    const val = this.items[key];
    delete this.items[key];
    this.count--;
    return val;
  }

  public Item(key: string): T {
    return this.items[key];
  }

  public Keys(): Array<string> {
    // const keySet: Array<string> = [];

    // for (const prop in this.items) {
    //     if (this.items.hasOwnProperty(prop)) {
    //         keySet.push(prop);
    //     }
    // }

    // return keySet;
    return Object.keys(this.items);
  }

  public Values(): Array<T> {
    const values: Array<T> = [];

    for (const prop in this.items) {
      if (this.items.hasOwnProperty(prop)) {
        values.push(this.items[prop]);
      }
    }

    return values;
  }

  public ForEach(callbackfn: (key: string, value: T) => void): void {
    for (const prop in this.items) {
      callbackfn(prop, this.items[prop]);
    }
  }
}
