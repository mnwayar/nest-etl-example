import { Module } from '@nestjs/common';
import { HubspotModule } from '../hubspot/hubspot.module';
import { SyncHubspotCompaniesArchivedUseCase } from '../../core/application/companies/usecases/sync-hubspot-companies-archived.usecase';
import { SyncHubspotCompaniesUpdatedUseCase } from '../../core/application/companies/usecases/sync-hubspot-companies-updated.usecase';
import { CompaniesPersistenceModule } from '../persistence/companies-persistence.module';
import { ContactsPersistenceModule } from '@infra/persistence/contacts-persistence.module';
import { SyncHubspotContactsUseCase } from '@core/application/contacts/usecases/sync-hubspot-contacts.usecase';
import { CrmSyncCheckpointsPersistenceModule } from '../persistence/crm-sync-checkpoints-persistence.module copy';

@Module({
  imports: [
    CrmSyncCheckpointsPersistenceModule,
    CompaniesPersistenceModule,
    ContactsPersistenceModule,
    HubspotModule,
  ],
  providers: [
    SyncHubspotCompaniesArchivedUseCase,
    SyncHubspotCompaniesUpdatedUseCase,
    SyncHubspotContactsUseCase,
  ],
  exports: [
    SyncHubspotCompaniesArchivedUseCase,
    SyncHubspotCompaniesUpdatedUseCase,
    SyncHubspotContactsUseCase,
  ],
})
export class EtlModule {}
