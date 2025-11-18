/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { HubspotCompanyProvider } from '@core/application/companies/ports/hubspot-company.provider';
import { HubspotCompanyRaw } from '@core/application/companies/types/hubspot-company.type';
import { HubspotSearchFilter } from '../../../core/application/shared/types/hubspot-search-filter.type';
import { HubSpotService } from './hubspot.service';
import { ConfigService } from '@nestjs/config';
import { RestClientService } from '../../http/rest-client.service';

@Injectable()
export class HubspotCompanyService
  extends HubSpotService<HubspotCompanyRaw>
  implements HubspotCompanyProvider
{
  private readonly logger = new Logger(HubspotCompanyService.name);

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(configService: ConfigService, restClient: RestClientService) {
    super(configService, restClient);
  }

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

  protected mapItem(item: any): HubspotCompanyRaw {
    return {
      id: item.id,
      properties: item.properties ?? {},
      archived: item.archived ?? false,
      url: item.url,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      archivedAt: item.archivedAt,
    };
  }

  async fetchUpdatedCompanies(
    limit?: number,
    filters?: HubspotSearchFilter[],
  ): Promise<HubspotCompanyRaw[]> {
    const url = 'crm/objects/v3/companies/search';
    const params: Record<string, any> = {
      properties: this.companyProperties,
      filterGroups: filters?.length ? [{ filters }] : undefined,
    };

    const companies = await this.fetchEntities(url, 'post', params, limit);

    if (companies.length === 0) {
      this.logger.log('No companies returned from HubSpot');
    }

    return companies;
  }

  async fetchArchivedCompanies(limit?: number): Promise<HubspotCompanyRaw[]> {
    const url = 'crm/objects/v3/companies';
    const params: Record<string, any> = {
      properties: this.companyProperties.join(','),
      archived: true,
    };

    const companies = await this.fetchEntities(url, 'get', params, limit);

    if (companies.length === 0) {
      this.logger.log('No companies returned from HubSpot');
    }

    return companies;
  }
}
