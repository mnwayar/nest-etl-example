import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactOrmEntity } from './typeorm/entities/contact.orm-entity';
import { ContactTypeOrmRepository } from './repositories/contact.typeorm.repository';
import { ContactRepositoryToken } from '@core/domain/contacts/contact.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ContactOrmEntity])],
  providers: [
    ContactTypeOrmRepository,
    {
      provide: ContactRepositoryToken,
      useClass: ContactTypeOrmRepository,
    },
  ],
  exports: [ContactRepositoryToken, ContactTypeOrmRepository],
})
export class ContactsPersistenceModule {}
