import { Company } from './company.entity';

export const CompanyRepositoryToken = Symbol('CompanyRepository');

export interface CompanyRepository {
  sync(companies: Company[]): Promise<void>;
  getAll(): Promise<Company[]>;
  getById(id: string): Promise<Company | null>;
}

