import { Inject, Injectable } from '@nestjs/common';
import {
  ContactRepository,
  ContactRepositoryToken,
} from '@core/domain/contacts/contact.repository';
import { Contact } from '@core/domain/contacts/contact.entity';
import { ListAllEntitiesUseCase } from '../../shared/usecases/list-all-entities.usecase';

@Injectable()
export class ListAllContactsUseCase extends ListAllEntitiesUseCase<Contact> {
  constructor(
    @Inject(ContactRepositoryToken)
    contactRepository: ContactRepository,
  ) {
    super(contactRepository);
  }
}
