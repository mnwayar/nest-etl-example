export type HubspotContactRaw = {
  id: string;
  properties?: {
    createdate?: string;
    hs_lastmodifieddate?: string;
    hs_object_id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
  };
  archived?: boolean;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
};
