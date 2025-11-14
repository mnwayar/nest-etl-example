import { HubspotBaseProperties } from '../../shared/types/hubspot-base-properties.type';
import { HubspotBaseRaw } from '../../shared/types/hubspot-base-raw.type';

export interface HubspotContactProperties extends HubspotBaseProperties {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
}

export type HubspotContactRaw = HubspotBaseRaw<HubspotContactProperties>;
