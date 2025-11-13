import { Module } from '@nestjs/common';
import { HubspotModule } from '../hubspot/hubspot.module';
import { SyncHubspotCompaniesUseCase } from '@core/application/companies/usecases/sync-hubspot-companies.usecase';
import { CompaniesPersistenceModule } from '../persistence/companies-persistence.module';

@Module({
  imports: [
    CompaniesPersistenceModule,
    HubspotModule,
  ],
  providers: [
    SyncHubspotCompaniesUseCase
  ],
  exports: [
    SyncHubspotCompaniesUseCase,
  ],
})
export class EtlModule {}
