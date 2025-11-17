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

@Injectable()
export class SyncHubspotArchivedDealsUseCase extends SyncHubspotEntityUseCase<
  Deal,
  HubspotDealRaw
> {
  constructor(
    @Inject(DealRepositoryToken)
    dealsRepository: DealRepository,

    @Inject(HubspotDealProviderToken)
    private readonly hubspotProvider: HubspotDealProvider,
  ) {
    super(dealsRepository);
  }

  protected fetchFromHubspot(limit?: number): Promise<HubspotDealRaw[]> {
    return this.hubspotProvider.fetchArchivedDeals(limit);
  }

  protected mapToDomain(raw: HubspotDealRaw): Deal {
    return HubspotDealMapper.toDomain(raw);
  }
}
