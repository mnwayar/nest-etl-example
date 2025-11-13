import { Module } from '@nestjs/common';
import { CompaniesPersistenceModule } from '../../../infrastructure/persistence/companies-persistence.module';
import { CompaniesController } from './companies.controller';
import { ListAllCompaniesUseCase } from '../../../core/application/companies/usecases/list-all-companies.usecase';
import { GetCompanyDetailsUseCase } from '../../../core/application/companies/usecases/get-company-details.usecase';

@Module({
  imports: [CompaniesPersistenceModule],
  controllers: [CompaniesController],
  providers: [ListAllCompaniesUseCase, GetCompanyDetailsUseCase],
})
export class CompaniesHttpModule {}
