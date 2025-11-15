/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RestClientService } from '../../http/rest-client.service';
import { HubspotCompanyProvider } from '@core/application/companies/ports/hubspot-company.provider';
import { HubspotCompanyRaw } from '@core/application/companies/types/hubspot-company.type';

@Injectable()
export class HubspotCompanyService implements HubspotCompanyProvider {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly defaultLimit: number;

  private readonly companyProperties = [
    'name',
    'domain',
    'phone',
    'city',
    'country',
    'industry',
    'createdate',
    'hs_lastmodifieddate',
    'hs_object_id',
    'hs_logo_url',
    'numberofemployees',
  ];

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
    this.defaultLimit = this.configService.get<number>('hubspot.limit') ?? 10;
  }

  async fetchCompanies(limit?: number): Promise<HubspotCompanyRaw[]> {
    const pageSize = limit ?? this.defaultLimit;
    const companies: HubspotCompanyRaw[] = [];

    let after: string | undefined = undefined;
    let hasNext: boolean;

    do {
      const url = `${this.baseUrl}crm/objects/v3/companies`;
      const params: Record<string, any> = {
        limit: pageSize,
        properties: this.companyProperties.join(','),
      };

      if (after) params.after = after;

      const data = await this.restClient.get(url, params, this.token);
      const results = data.results ?? [];

      for (const item of results) {
        companies.push({
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

    if (companies.length === 0) {
      throw new Error('No companies returned from HubSpot');
    }

    return companies;
  }
}
