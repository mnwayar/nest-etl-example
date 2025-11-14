export interface CrmRepository<T> {
  syncFromSource(entities: T[]): Promise<void>;
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
}
