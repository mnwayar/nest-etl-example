import { Contact } from './contact.entity';

export const ContactRepositoryToken = Symbol('ContactRepository');

export interface ContactRepository {
  sync(contacts: Contact[]): Promise<void>;
  getAll(): Promise<Contact[]>;
  getById(id: string): Promise<Contact | null>;
}
