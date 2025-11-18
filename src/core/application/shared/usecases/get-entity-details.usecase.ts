import { NotFoundError } from '@shared/errors';
import { CrmRepository } from '../../../domain/shared/repositories/crm.repository';

export abstract class GetEntityDetailsUseCase<T> {
  constructor(
    private readonly crmRepository: CrmRepository<T>,
    private readonly entityName: string,
  ) {}

  async execute(id: string): Promise<T> {
    const entity = await this.crmRepository.getById(id);

    if (!entity) {
      throw new NotFoundError(`${this.entityName} not found`);
    }

    return entity;
  }
}
