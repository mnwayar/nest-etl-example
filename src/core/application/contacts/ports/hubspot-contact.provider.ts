export interface HubspotContactProvider {
  fetchContacts(limit?: number): Promise<Array<{
    id: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    archived?: boolean;
    raw?: Record<string, any>;
  }>>;
}