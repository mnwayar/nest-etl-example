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
import { SyncHubspotEntityUsecase } from '../../shared/usecases/sync-hubspot-entity.usecase';

@Injectable()
export class SyncHubspotContactsUseCase extends SyncHubspotEntityUsecase<
  Contact,
  HubspotContactRaw
> {
  constructor(
    @Inject(ContactRepositoryToken)
    contactRepository: ContactRepository,

    @Inject(HubspotContactProviderToken)
    private readonly hubspotProvider: HubspotContactProvider,
  ) {
    super(contactRepository);
  }

  protected fetchFromHubspot(limit?: number): Promise<HubspotContactRaw[]> {
    return this.hubspotProvider.fetchContacts(limit);
  }

  protected mapToDomain(raw: HubspotContactRaw): Contact {
    return HubspotContactMapper.toDomain(raw);
  }
}
