/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RestClientService } from '../../http/rest-client.service';

import { HubspotContactAssociationProvider } from '@core/application/associations/ports/hubspot-contact-association.provider';
import { HubspotContactAssociationRaw } from '@core/application/associations/types/hubspot-contact-association.type';
import { HubspotApiError, InfrastructureError } from '@shared/errors';

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
      throw new InfrastructureError('HubSpot configuration is missing');
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

    try {
      const data: any = await this.restClient.post(url, body, this.token);
      return (data.results ?? []) as HubspotContactAssociationRaw[];
    } catch (error) {
      const statusCode = this.extractStatusCode(error);
      throw new HubspotApiError(
        `Failed calling HubSpot API crm/v4/associations/contacts/${to}/batch/read`,
        statusCode,
        error,
      );
    }
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

  private extractStatusCode(error: unknown): number | undefined {
    if (error instanceof HttpException) {
      return error.getStatus();
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as any).response?.status === 'number'
    ) {
      return (error as any).response.status as number;
    }

    return undefined;
  }
}
