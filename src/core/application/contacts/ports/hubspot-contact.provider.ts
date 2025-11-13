import { HubspotContactRaw } from '../types/hubspot-contact.type'

export const HubspotContactProviderToken = Symbol('HubspotContactProvider');
export interface HubspotContactProvider {
  fetchContacts(limit?: number): Promise<HubspotContactRaw[]>;
}