import { HubspotDealRaw } from '../types/hubspot-deal.type';

export const HubspotDealProviderToken = Symbol('HubspotDealProvider');
export interface HubspotDealProvider {
  fetchDeals(limit?: number): Promise<HubspotDealRaw[]>;
}
