/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RestClientService } from '../../http/rest-client.service';

import { HubspotContactAssociationProvider } from '@core/application/associations/ports/hubspot-contact-association.provider';
import { HubspotContactAssociationRaw } from '@core/application/associations/types/hubspot-contact-association.type';

@Injectable()
export class HubspotContactAssociationService
  implements HubspotContactAssociationProvider
{
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly restClient: RestClientService,
  ) {
    const baseUrl: string | undefined =
      this.configService.get<string>('hubspot.baseUrl');
    const token: string | undefined =
      this.configService.get<string>('hubspot.token');

    if (!baseUrl || !token) {
      throw new Error('HubSpot configuration is missing');
    }

    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async batchRead(
    to: 'companies' | 'deals',
    contactIds: string[],
  ): Promise<HubspotContactAssociationRaw[]> {
    if (!contactIds.length) return [];

    const url = `${this.baseUrl}crm/v4/associations/contacts/${to}/batch/read`;

    const body = {
      inputs: contactIds.map((id) => ({ id })),
    };

    const data: any = await this.restClient.post(url, body, this.token);

    return (data.results ?? []) as HubspotContactAssociationRaw[];
  }

  async fetchAssociationsForContacts(contactSourceIds: string[]): Promise<{
    companies: HubspotContactAssociationRaw[];
    deals: HubspotContactAssociationRaw[];
  }> {
    if (!contactSourceIds.length) {
      return { companies: [], deals: [] };
    }

    const [companies, deals] = await Promise.all([
      this.batchRead('companies', contactSourceIds),
      this.batchRead('deals', contactSourceIds),
    ]);

    return { companies, deals };
  }
}
