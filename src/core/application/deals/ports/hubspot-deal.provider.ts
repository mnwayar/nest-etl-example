import { HubspotSearchFilter } from '../../shared/types/hubspot-search-filter.type';
import { HubspotDealRaw } from '../types/hubspot-deal.type';

export const HubspotDealProviderToken = Symbol('HubspotDealProvider');
export interface HubspotDealProvider {
  fetchArchivedDeals(limit?: number): Promise<HubspotDealRaw[]>;
  fetchUpdatedDeals(
    limit?: number,
    filters?: HubspotSearchFilter[],
  ): Promise<HubspotDealRaw[]>;
}
