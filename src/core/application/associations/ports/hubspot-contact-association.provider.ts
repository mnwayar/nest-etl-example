import { HubspotContactAssociationRaw } from '../types/hubspot-contact-association.type';

export const HubspotContactAssociationProviderToken = Symbol(
  'HubspotContactAssociationProvider',
);

export interface HubspotContactAssociationProvider {
  fetchAssociationsForContacts(contactSourceIds: string[]): Promise<{
    companies: HubspotContactAssociationRaw[];
    deals: HubspotContactAssociationRaw[];
  }>;
}
