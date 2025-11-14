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
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SyncHubspotContactsUseCase {
  constructor(
    @Inject(ContactRepositoryToken)
    private readonly contactRepository: ContactRepository,

    @Inject(HubspotContactProviderToken)
    private readonly hubspotProvider: HubspotContactProvider,
  ) {}

  async execute(limit?: number): Promise<void> {
    const remoteContacts = await this.hubspotProvider.fetchContacts(limit);

    const contacts: Contact[] = remoteContacts.map((contact) => {
      return HubspotContactMapper.toDomain(contact);
    });

    await this.contactRepository.sync(contacts);
  }
}
