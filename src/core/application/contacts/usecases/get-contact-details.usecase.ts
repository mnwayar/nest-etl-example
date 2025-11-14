import { Inject, Injectable } from '@nestjs/common';
import {
  ContactRepository,
  ContactRepositoryToken,
} from '@core/domain/contacts/contact.repository';
import { Contact } from '@core/domain/contacts/contact.entity';

@Injectable()
export class GetContactDetailsUseCase {
  constructor(
    @Inject(ContactRepositoryToken)
    private readonly contactRepository: ContactRepository,
  ) {}

  async execute(id: string): Promise<Contact | null> {
    return this.contactRepository.getById(id);
  }
}
