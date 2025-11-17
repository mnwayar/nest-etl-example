import { Inject, Injectable } from '@nestjs/common';
import { Contact } from '@core/domain/contacts/contact.entity';
import {
  ContactRepository,
  ContactRepositoryToken,
} from '@core/domain/contacts/contact.repository';
import {
  HubspotContactProvider,
  HubspotContactProviderToken,
} from '../ports/hubspot-contact.provider';
import { HubspotContactMapper } from '../mappers/hubspot-contact.mapper';
import { HubspotContactRaw } from '../types/hubspot-contact.type';
import { SyncHubspotEntityUseCase } from '../../shared/usecases/sync-hubspot-entity.usecase';
import {
  CrmObjectType,
  CrmSyncCheckpoint,
} from '../../../domain/shared/entities/crm-sync-checkpoint.entity';
import {
  CrmSyncCheckpointRepository,
  CrmSyncCheckpointRepositoryToken,
} from '../../../domain/shared/repositories/crm-sync-checkpoint.repository';
import { HubspotSearchFilter } from '../../shared/types/hubspot-search-filter.type';

@Injectable()
export class SyncHubspotUpdatedContactsUseCase extends SyncHubspotEntityUseCase<
  Contact,
  HubspotContactRaw
> {
  constructor(
    @Inject(ContactRepositoryToken)
    contactRepository: ContactRepository,

    @Inject(HubspotContactProviderToken)
    private readonly hubspotProvider: HubspotContactProvider,

    @Inject(CrmSyncCheckpointRepositoryToken)
    private readonly crmSyncRepository: CrmSyncCheckpointRepository,
  ) {
    super(contactRepository);
  }

  private syncObjectType: CrmObjectType = 'CONTACT';
  private filters: HubspotSearchFilter[] = [];

  protected async beforeExecute(): Promise<void> {
    const last: CrmSyncCheckpoint | null =
      await this.crmSyncRepository.getLastSyncByObjectType(this.syncObjectType);
    const lastRunAt: number = last?.lastRunAt.getTime() ?? 0;

    this.filters = [
      {
        propertyName: 'hs_lastmodifieddate',
        operator: 'GT',
        value: lastRunAt,
      },
      {
        propertyName: 'lifecyclestage',
        operator: 'EQ',
        value: 'lead',
      },
    ];
  }

  protected async fetchFromHubspot(
    limit?: number,
  ): Promise<HubspotContactRaw[]> {
    return this.hubspotProvider.fetchUpdatedContacts(limit, this.filters);
  }

  protected mapToDomain(raw: HubspotContactRaw): Contact {
    return HubspotContactMapper.toDomain(raw);
  }

  protected async afterExecute(_entities: Contact[]): Promise<void> {
    if (!_entities.length) return;

    let lastModifiedDate: Date = _entities[0].sourceUpdatedAt ?? new Date();
    _entities.map((entity: Contact) => {
      if (entity.sourceUpdatedAt && entity.sourceUpdatedAt > lastModifiedDate) {
        lastModifiedDate = entity.sourceUpdatedAt;
      }
    });

    //last modified date - 1 min, just to avoid miss changes
    lastModifiedDate = new Date(lastModifiedDate.getTime() - 60_000);

    await this.crmSyncRepository.createNewSync(
      this.syncObjectType,
      lastModifiedDate,
    );
  }
}
