import { Deal } from './deal.entity';
import { CrmRepository } from '../shared/repositories/crm.repository';

export const DealRepositoryToken = Symbol('DealRepository');

export interface DealRepository extends CrmRepository<Deal> {}
