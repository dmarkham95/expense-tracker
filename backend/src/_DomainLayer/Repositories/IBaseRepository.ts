
export interface BaseRepository<T> {
    exists(t: T): Promise<boolean>;
    delete(t: T): Promise<any>;
    save(t: T): Promise<any>;
    update(t: T): Promise<any>;
  }