/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { HubspotContactProvider } from '@core/application/contacts/ports/hubspot-contact.provider';
import { HubspotContactRaw } from '@core/application/contacts/types/hubspot-contact.type';
import { HubspotSearchFilter } from '../../../core/application/shared/types/hubspot-search-filter.type';
import { HubSpotService } from './hubspot.service';
import { ConfigService } from '@nestjs/config';
import { RestClientService } from '../../http/rest-client.service';

@Injectable()
export class HubspotContactService
  extends HubSpotService<HubspotContactRaw>
  implements HubspotContactProvider
{
  private readonly logger = new Logger(HubspotContactService.name);

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(configService: ConfigService, restClient: RestClientService) {
    super(configService, restClient);
  }

  private readonly contactProperties = [
    'email',
    'firstname',
    'lastname',
    'phone',
    'hs_lastmodifieddate',
    'hs_object_id',
    'lifecyclestage',
  ];

  protected mapItem(item: any): HubspotContactRaw {
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

  async fetchUpdatedContacts(
    limit?: number,
    filters?: HubspotSearchFilter[],
  ): Promise<HubspotContactRaw[]> {
    const url = 'crm/objects/v3/contacts/search';

    const params: Record<string, any> = {
      properties: this.contactProperties,
      filterGroups: filters?.length ? [{ filters }] : undefined,
    };

    const contacts = await this.fetchEntities(url, 'post', params, limit);

    if (contacts.length === 0) {
      this.logger.log('No contacts returned from HubSpot');
    }

    return contacts;
  }

  async fetchArchivedContacts(limit?: number): Promise<HubspotContactRaw[]> {
    const url = 'crm/objects/v3/contacts';
    const params: Record<string, any> = {
      properties: this.contactProperties.join(','),
      archived: true,
    };

    const contacts = await this.fetchEntities(url, 'get', params, limit);

    if (contacts.length === 0) {
      this.logger.log('No contacts returned from HubSpot');
    }

    return contacts;
  }
}
