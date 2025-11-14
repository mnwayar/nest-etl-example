import { Company } from './company.entity';
import { CrmRepository } from '../shared/repositories/crm.repository';

export const CompanyRepositoryToken = Symbol('CompanyRepository');

export interface CompanyRepository extends CrmRepository<Company> {}
