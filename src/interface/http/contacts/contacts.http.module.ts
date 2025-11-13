import { Module } from '@nestjs/common';
import { ContactsPersistenceModule } from '@infra/persistence/contacts-persistence.module';
import { ContactsController } from './contacts.controller';
import { ListAllContactsUseCase } from '@core/application/contacts/usecases/list-all-contacts.usecase';
import { GetContactDetailsUseCase } from '@core/application/contacts/usecases/get-contact-details.usecase';

@Module({
  imports: [ContactsPersistenceModule],
  controllers: [ContactsController],
  providers: [ListAllContactsUseCase, GetContactDetailsUseCase],
})
export class ContactsHttpModule {}
