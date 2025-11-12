import { Contact } from '../../../domain/contacts/contact.entity';
import { ContactRepository } from '../../../domain/contacts/contact.repository';
import { HubspotContactProvider } from '../ports/hubspot-contact.provider';

export class SyncHubspotContactsUseCase {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly hubspotProvider: HubspotContactProvider,
  ) {}

  async execute(limit?: number): Promise<void> {
    const remoteContacts = await this.hubspotProvider.fetchContacts(limit);

    const contacts = remoteContacts.map((contact) => {
      return new Contact(
        contact.id,
        contact.firstname ?? null,
        contact.lastname ?? null,  
        contact.email ?? null,      
        contact.archived ? 'ARCHIVED':'ACTIVE',
        contact.raw,                
      );
    });

    await this.contactRepository.sync(contacts);
  }
}
