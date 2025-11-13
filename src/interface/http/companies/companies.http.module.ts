import { Module } from '@nestjs/common';
import { CompaniesPersistenceModule } from '../../../infrastructure/persistence/companies-persistence.module';
import { CompaniesController } from './companies.controller';
import { ListAllCompaniesUseCase } from '../../../core/application/companies/usecases/list-all-companies.usecase';

@Module({
  imports: [CompaniesPersistenceModule],
  controllers: [CompaniesController],
  providers: [ListAllCompaniesUseCase],
})
export class CompaniesHttpModule {}
