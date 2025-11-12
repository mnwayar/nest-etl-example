import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HubspotModule } from '../hubspot/hubspot.module';
import { CompanyOrmEntity } from '../persistence/typeorm/entities/company.orm-entity';
import { CompanyTypeOrmRepository } from '../persistence/repositories/company.typeorm.repository';
import { SyncHubspotCompaniesUseCase } from '../../core/application/companies/usecases/sync-hubspot-companies.usecase';
import { HubspotCompanyService } from '../hubspot/services/hubspot-company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyOrmEntity]),
    HubspotModule,
  ],
  providers: [
    CompanyTypeOrmRepository,
    {
      provide: SyncHubspotCompaniesUseCase,
      useFactory: (
        companyRepository: CompanyTypeOrmRepository,
        hubspotProvider: HubspotCompanyService,
      ) => {
        return new SyncHubspotCompaniesUseCase(
          companyRepository,
          hubspotProvider,
        );
      },
      inject: [CompanyTypeOrmRepository, HubspotCompanyService],
    },
  ],
  exports: [
    SyncHubspotCompaniesUseCase,
    CompanyTypeOrmRepository
  ],
})
export class EtlModule {}
