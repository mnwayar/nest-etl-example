import { HubspotBaseProperties } from './hubspot-base-properties.type';

export interface HubspotBaseRaw<
  TProps extends HubspotBaseProperties = HubspotBaseProperties,
> {
  id: string;
  archived: boolean;
  properties: TProps | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  url?: string | null;
}
