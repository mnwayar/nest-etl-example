import { HubspotCompanyRaw } from '../types/hubspot-company.type'

export interface HubspotCompanyProvider {
  fetchCompanies(limit?: number): Promise<HubspotCompanyRaw[]>;
}