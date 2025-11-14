import { Inject, Injectable } from '@nestjs/common';
import {
  ContactRepository,
  ContactRepositoryToken,
} from '@core/domain/contacts/contact.repository';
import { Contact } from '@core/domain/contacts/contact.entity';

@Injectable()
export class ListAllContactsUseCase {
  constructor(
    @Inject(ContactRepositoryToken)
    private readonly contactRepository: ContactRepository,
  ) {}

  async execute(): Promise<Contact[]> {
    return this.contactRepository.getAll();
  }
}
