import { HubspotBaseProperties } from '../../shared/types/hubspot-base-properties.type';
import { HubspotBaseRaw } from '../../shared/types/hubspot-base-raw.type';

export interface HubspotDealProperties extends HubspotBaseProperties {
  dealname?: string;
  dealstage?: string;
  closedate?: string;
  amount?: string;
}

export type HubspotDealRaw = HubspotBaseRaw<HubspotDealProperties>;
