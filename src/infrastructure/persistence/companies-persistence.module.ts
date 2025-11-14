import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyOrmEntity } from './typeorm/entities/company.orm-entity';
import { CompanyTypeOrmRepository } from './repositories/company.typeorm.repository';
import { CompanyRepositoryToken } from '@core/domain/companies/company.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyOrmEntity])],
  providers: [
    CompanyTypeOrmRepository,
    {
      provide: CompanyRepositoryToken,
      useClass: CompanyTypeOrmRepository,
    },
  ],
  exports: [CompanyRepositoryToken, CompanyTypeOrmRepository],
})
export class CompaniesPersistenceModule {}
