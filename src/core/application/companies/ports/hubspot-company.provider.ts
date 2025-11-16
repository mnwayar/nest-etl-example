import { HubspotSearchFilter } from '../../shared/types/hubspot-search-filter.type';
import { HubspotCompanyRaw } from '../types/hubspot-company.type';

export const HubspotCompanyProviderToken = Symbol('HubspotCompanyProvider');
export interface HubspotCompanyProvider {
  fetchArchivedCompanies(limit?: number): Promise<HubspotCompanyRaw[]>;
  fetchUpdatedCompanies(
    limit?: number,
    filters?: HubspotSearchFilter[],
  ): Promise<HubspotCompanyRaw[]>;
}
