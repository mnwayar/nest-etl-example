export type HubspotCompanyRaw = {
  id: string;
  properties?: {
    createdate?: string;
    domain?: string;
    hs_lastmodifieddate?: string;
    hs_object_id?: string;
    name?: string;
    phone?: string;
    city?: string;
    country?: string;
    industry?: string;
  };
  archived?: boolean;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
};
