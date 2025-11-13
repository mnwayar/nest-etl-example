import { HubspotCompanyRaw } from '../types/hubspot-company.type'

export const HubspotCompanyProviderToken = Symbol('HubspotCompanyProvider');
export interface HubspotCompanyProvider {
  fetchCompanies(limit?: number): Promise<HubspotCompanyRaw[]>;
}