import { Module } from '@nestjs/common';
import { HubspotModule } from '../hubspot/hubspot.module';
import { SyncHubspotCompaniesUseCase } from '@core/application/companies/usecases/sync-hubspot-companies.usecase';
import { CompaniesPersistenceModule } from '../persistence/companies-persistence.module';
import { ContactsPersistenceModule } from '@infra/persistence/contacts-persistence.module';
import { SyncHubspotContactsUseCase } from '@core/application/contacts/usecases/sync-hubspot-contacts.usecase';

@Module({
  imports: [
    CompaniesPersistenceModule,
    ContactsPersistenceModule,
    HubspotModule,
  ],
  providers: [
    SyncHubspotCompaniesUseCase,
    SyncHubspotContactsUseCase
  ],
  exports: [
    SyncHubspotCompaniesUseCase,
    SyncHubspotContactsUseCase
  ],
})
export class EtlModule {}
