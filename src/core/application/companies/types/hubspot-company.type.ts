import { HubspotBaseProperties } from '../../shared/types/hubspot-base-properties.type';
import { HubspotBaseRaw } from '../../shared/types/hubspot-base-raw.type';

export interface HubspotCompanyProperties extends HubspotBaseProperties {
  domain?: string;
  name?: string;
  phone?: string;
  city?: string;
  country?: string;
  industry?: string;
}

export type HubspotCompanyRaw = HubspotBaseRaw<HubspotCompanyProperties>;
