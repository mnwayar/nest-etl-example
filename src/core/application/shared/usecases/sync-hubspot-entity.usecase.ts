import { CrmRepository } from '../../../domain/shared/repositories/crm.repository';

export abstract class SyncHubspotEntityUsecase<TDomain, TRaw> {
  constructor(protected readonly crmRepository: CrmRepository<TDomain>) {}

  protected abstract fetchFromHubspot(limit?: number): Promise<TRaw[]>;

  protected abstract mapToDomain(raw: TRaw): TDomain;

  async execute(limit?: number): Promise<void> {
    const raws = await this.fetchFromHubspot(limit);
    const entities = raws.map((raw) => this.mapToDomain(raw));
    await this.crmRepository.syncFromSource(entities);
  }
}
