import { CrmRepository } from '../../../domain/shared/repositories/crm.repository';

export abstract class SyncHubspotEntityUsecase<TDomain, TRaw> {
  constructor(protected readonly crmRepository: CrmRepository<TDomain>) {}

  protected abstract fetchFromHubspot(limit?: number): Promise<TRaw[]>;

  protected abstract mapToDomain(raw: TRaw): TDomain;

  protected async beforeExecute(): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async afterExecute(_entities: TDomain[]): Promise<void> {}

  async execute(limit?: number): Promise<void> {
    await this.beforeExecute();
    const raws = await this.fetchFromHubspot(limit);
    const entities = raws.map((raw) => this.mapToDomain(raw));
    await this.crmRepository.syncFromSource(entities);
    await this.afterExecute(entities);
  }
}
