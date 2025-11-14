import { CrmRepository } from '../../../domain/shared/repositories/crm.repository';

export abstract class GetEntityDetailsUseCase<T> {
  constructor(private readonly crmRepository: CrmRepository<T>) {}

  async execute(id: string): Promise<T | null> {
    return this.crmRepository.getById(id);
  }
}
