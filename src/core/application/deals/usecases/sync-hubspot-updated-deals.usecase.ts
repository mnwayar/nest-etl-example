import { Inject, Injectable } from '@nestjs/common';
import { Deal } from '@core/domain/deals/deal.entity';
import {
  DealRepository,
  DealRepositoryToken,
} from '@core/domain/deals/deal.repository';
import {
  HubspotDealProvider,
  HubspotDealProviderToken,
} from '../ports/hubspot-deal.provider';
import { HubspotDealMapper } from '../mappers/hubspot-deal.mapper';
import { HubspotDealRaw } from '../types/hubspot-deal.type';
import { SyncHubspotEntityUseCase } from '../../shared/usecases/sync-hubspot-entity.usecase';
import {
  CrmObjectType,
  CrmSyncCheckpoint,
} from '../../../domain/shared/entities/crm-sync-checkpoint.entity';
import {
  CrmSyncCheckpointRepository,
  CrmSyncCheckpointRepositoryToken,
} from '../../../domain/shared/repositories/crm-sync-checkpoint.repository';
import { HubspotSearchFilter } from '../../shared/types/hubspot-search-filter.type';

@Injectable()
export class SyncHubspotUpdatedDealsUseCase extends SyncHubspotEntityUseCase<
  Deal,
  HubspotDealRaw
> {
  constructor(
    @Inject(DealRepositoryToken)
    dealRepository: DealRepository,

    @Inject(HubspotDealProviderToken)
    private readonly hubspotProvider: HubspotDealProvider,

    @Inject(CrmSyncCheckpointRepositoryToken)
    private readonly crmSyncRepository: CrmSyncCheckpointRepository,
  ) {
    super(dealRepository);
  }

  private syncObjectType: CrmObjectType = 'DEAL';
  private filters: HubspotSearchFilter[] = [];

  protected async beforeExecute(): Promise<void> {
    const last: CrmSyncCheckpoint | null =
      await this.crmSyncRepository.getLastSyncByObjectType(this.syncObjectType);
    const lastRunAt: number = last?.lastRunAt.getTime() ?? 0;

    this.filters = [
      {
        propertyName: 'hs_lastmodifieddate',
        operator: 'GT',
        value: lastRunAt,
      },
    ];
  }

  protected async fetchFromHubspot(limit?: number): Promise<HubspotDealRaw[]> {
    return this.hubspotProvider.fetchUpdatedDeals(limit, this.filters);
  }

  protected mapToDomain(raw: HubspotDealRaw): Deal {
    return HubspotDealMapper.toDomain(raw);
  }

  protected async afterExecute(_entities: Deal[]): Promise<void> {
    if (!_entities.length) return;

    let lastModifiedDate: Date = _entities[0].sourceUpdatedAt ?? new Date();
    _entities.map((entity: Deal) => {
      if (entity.sourceUpdatedAt && entity.sourceUpdatedAt > lastModifiedDate) {
        lastModifiedDate = entity.sourceUpdatedAt;
      }
    });

    //last modified date - 1 min, just to avoid miss changes
    lastModifiedDate = new Date(lastModifiedDate.getTime() - 60_000);

    await this.crmSyncRepository.createNewSync(
      this.syncObjectType,
      lastModifiedDate,
    );
  }
}
