import { Inject, Injectable } from '@nestjs/common';
import {
  ContactRepository,
  ContactRepositoryToken,
} from '@core/domain/contacts/contact.repository';
import { Contact } from '@core/domain/contacts/contact.entity';
import { GetEntityDetailsUseCase } from '../../shared/usecases/get-entity-details.usecase';

@Injectable()
export class GetContactDetailsUseCase extends GetEntityDetailsUseCase<Contact> {
  constructor(
    @Inject(ContactRepositoryToken)
    contactRepository: ContactRepository,
  ) {
    super(contactRepository);
  }
}
