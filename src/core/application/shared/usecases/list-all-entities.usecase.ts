import { CrmRepository } from '../../../domain/shared/repositories/crm.repository';

export abstract class ListAllEntitiesUseCase<T> {
  constructor(private readonly crmRepository: CrmRepository<T>) {}

  async execute(): Promise<T[]> {
    return this.crmRepository.getAll();
  }
}
