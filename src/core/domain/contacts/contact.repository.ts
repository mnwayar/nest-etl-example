import { Contact } from './contact.entity';
import { CrmRepository } from '../shared/repositories/crm.repository';

export const ContactRepositoryToken = Symbol('ContactRepository');

export interface ContactRepository extends CrmRepository<Contact> {
  listSourceIdsUpdatedSince(since?: Date | null): Promise<string[]>;
}
