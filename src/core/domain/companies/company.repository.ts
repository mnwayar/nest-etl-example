import { Company } from './company.entity';

export interface CompanyRepository {
  sync(companies: Company[]): Promise<void>;
}
