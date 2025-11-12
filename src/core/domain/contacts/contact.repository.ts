import { Contact } from './contact.entity';

export interface ContactRepository {
  sync(contacts: Contact[]): Promise<void>;
}
