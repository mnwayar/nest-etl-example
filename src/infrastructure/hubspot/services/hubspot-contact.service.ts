import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RestClientService } from '../../http/rest-client.service';
import { HubspotContactProvider } from '@core/application/contacts/ports/hubspot-contact.provider';
import { HubspotContactRaw } from '@core/application/contacts/types/hubspot-contact.type';

@Injectable()
export class HubspotContactService implements HubspotContactProvider {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly defaultLimit: number;

  private readonly contactProperties = [
    'email',
    'firstname',
    'lastname',
    'phone',
    'createdate',
    'hs_lastmodifieddate',
    'hs_object_id',
    'hs_lead_status'
  ];

  constructor(
    private readonly configService: ConfigService,
    private readonly restClient: RestClientService,
  ) {
    this.baseUrl = this.configService.get<string>('hubspot.baseUrl')!;
    this.token = this.configService.get<string>('hubspot.token')!;
    this.defaultLimit = this.configService.get<number>('hubspot.limit') ?? 10;

    if (!this.baseUrl || !this.token) {
      throw new Error('HubSpot configuration is missing');
    }
  }

  async fetchContacts(limit?: number): Promise<HubspotContactRaw[]> {
    const pageSize = limit ?? this.defaultLimit;
    const contacts: HubspotContactRaw[] = [];

    let after: string | undefined = undefined;
    let hasNext: boolean;

    do {
      const url = `${this.baseUrl}contacts`;
      const params: Record<string, any> = { 
        limit: pageSize,
        properties: this.contactProperties.join(',')
      };
      
      if (after) params.after = after;

      const data = await this.restClient.get(url, params, this.token);
      const results = data.results ?? [];

      for (const item of results) {
        contacts.push({
          id: item.id,
          properties: item.properties ?? {},
          archived: item.archived ?? false,
          url: item.url,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      }

      after = data.paging?.next?.after;
      hasNext = Boolean(after);
    } while (hasNext);

    if (contacts.length === 0) {
      throw new Error('No Contacts returned from HubSpot');
    }

    return contacts;
  }
}
