import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactAssociationOrmEntity } from './typeorm/entities/contact-association.orm-entity';
import { ContactAssociationTypeOrmRepository } from './repositories/contact-association.typeorm.repository';
import { ContactAssociationRepositoryToken } from '@core/domain/associations/repositories/contact-association.repository';
import { ContactOrmEntity } from './typeorm/entities/contact.orm-entity';
import { CompanyOrmEntity } from './typeorm/entities/company.orm-entity';
import { DealOrmEntity } from './typeorm/entities/deal.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContactAssociationOrmEntity,
      ContactOrmEntity,
      CompanyOrmEntity,
      DealOrmEntity,
    ]),
  ],
  providers: [
    ContactAssociationTypeOrmRepository,
    {
      provide: ContactAssociationRepositoryToken,
      useClass: ContactAssociationTypeOrmRepository,
    },
  ],
  exports: [
    ContactAssociationRepositoryToken,
    ContactAssociationTypeOrmRepository,
  ],
})
export class ContactAssociationsPersistenceModule {}
