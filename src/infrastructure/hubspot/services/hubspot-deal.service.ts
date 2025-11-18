/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { HubspotDealProvider } from '@core/application/deals/ports/hubspot-deal.provider';
import { HubspotDealRaw } from '@core/application/deals/types/hubspot-deal.type';
import { HubspotSearchFilter } from '../../../core/application/shared/types/hubspot-search-filter.type';
import { HubSpotService } from './hubspot.service';
import { ConfigService } from '@nestjs/config';
import { RestClientService } from '../../http/rest-client.service';

@Injectable()
export class HubspotDealService
  extends HubSpotService<HubspotDealRaw>
  implements HubspotDealProvider
{
  private readonly logger = new Logger(HubspotDealService.name);

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(configService: ConfigService, restClient: RestClientService) {
    super(configService, restClient);
  }

  private readonly dealProperties = [
    'dealname',
    'dealstage',
    'amount',
    'closedate',
    'createdate',
    'hs_lastmodifieddate',
    'hs_object_id',
  ];

  protected mapItem(item: any): HubspotDealRaw {
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

  async fetchUpdatedDeals(
    limit?: number,
    filters?: HubspotSearchFilter[],
  ): Promise<HubspotDealRaw[]> {
    const url = 'crm/objects/v3/deals/search';
    const params: Record<string, any> = {
      properties: this.dealProperties,
      filterGroups: filters?.length ? [{ filters }] : undefined,
    };

    const deals = await this.fetchEntities(url, 'post', params, limit);

    if (deals.length === 0) {
      this.logger.log('No deals returned from HubSpot');
    }

    return deals;
  }

  async fetchArchivedDeals(limit?: number): Promise<HubspotDealRaw[]> {
    const url = 'crm/objects/v3/deals';
    const params: Record<string, any> = {
      properties: this.dealProperties.join(','),
      archived: true,
    };

    const deals = await this.fetchEntities(url, 'get', params, limit);

    if (deals.length === 0) {
      this.logger.log('No deals returned from HubSpot');
    }

    return deals;
  }
}
