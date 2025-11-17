export interface HubspotContactAssociationRaw {
  from: {
    id: string;
  };
  to?: HubspotContactAssociationTo[];
}

export interface HubspotContactAssociationTo {
  toObjectId: number;
  associationTypes?: HubspotContactAssociationType[];
}

export interface HubspotContactAssociationType {
  category: string;
  typeId: number;
  label: string | null;
}
