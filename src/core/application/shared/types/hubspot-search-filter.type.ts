export interface HubspotSearchFilter {
  propertyName: string;
  operator:
    | 'EQ'
    | 'NEQ'
    | 'GT'
    | 'GTE'
    | 'LT'
    | 'LTE'
    | 'BETWEEN'
    | 'IN'
    | 'NOT_IN'
    | 'HAS_PROPERTY'
    | 'CONTAINS_TOKEN'
    | 'NOT_CONTAINS_TOKEN';
  value?: string | number | boolean | string[] | null;
}
