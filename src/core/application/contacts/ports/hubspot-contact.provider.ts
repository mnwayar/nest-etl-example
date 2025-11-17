import { HubspotSearchFilter } from '../../shared/types/hubspot-search-filter.type';
import { HubspotContactRaw } from '../types/hubspot-contact.type';

export const HubspotContactProviderToken = Symbol('HubspotContactProvider');
export interface HubspotContactProvider {
  fetchArchivedContacts(limit?: number): Promise<HubspotContactRaw[]>;
  fetchUpdatedContacts(
    limit?: number,
    filters?: HubspotSearchFilter[],
  ): Promise<HubspotContactRaw[]>;
}
