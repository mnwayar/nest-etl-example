import { Module } from '@nestjs/common';
import { HubspotModule } from '../hubspot/hubspot.module';
import { CompaniesPersistenceModule } from '../persistence/companies-persistence.module';
import { ContactsPersistenceModule } from '@infra/persistence/contacts-persistence.module';
import { DealsPersistenceModule } from '@infra/persistence/deals-persistence.module';
import { CrmSyncCheckpointsPersistenceModule } from '../persistence/crm-sync-checkpoints-persistence.module';
import { SyncHubspotUpdatedCompaniesUseCase } from '../../core/application/companies/usecases/sync-hubspot-updated-companies.usecase';
import { SyncHubspotUpdatedContactsUseCase } from '../../core/application/contacts/usecases/sync-hubspot-updated-contacts.usecase';
import { SyncHubspotUpdatedDealsUseCase } from '../../core/application/deals/usecases/sync-hubspot-updated-deals.usecase';
import { SyncHubspotArchivedCompaniesUseCase } from '../../core/application/companies/usecases/sync-hubspot-archived-companies.usecase';
import { SyncHubspotArchivedContactsUseCase } from '../../core/application/contacts/usecases/sync-hubspot-archived-contacts.usecase';
import { SyncHubspotArchivedDealsUseCase } from '../../core/application/deals/usecases/sync-hubspot-archived-deals.usecase';

@Module({
  imports: [
    CrmSyncCheckpointsPersistenceModule,
    CompaniesPersistenceModule,
    ContactsPersistenceModule,
    DealsPersistenceModule,
    HubspotModule,
  ],
  providers: [
    SyncHubspotUpdatedCompaniesUseCase,
    SyncHubspotUpdatedContactsUseCase,
    SyncHubspotUpdatedDealsUseCase,
    SyncHubspotArchivedCompaniesUseCase,
    SyncHubspotArchivedContactsUseCase,
    SyncHubspotArchivedDealsUseCase,
  ],
  exports: [
    SyncHubspotUpdatedCompaniesUseCase,
    SyncHubspotUpdatedContactsUseCase,
    SyncHubspotUpdatedDealsUseCase,
    SyncHubspotArchivedCompaniesUseCase,
    SyncHubspotArchivedContactsUseCase,
    SyncHubspotArchivedDealsUseCase,
  ],
})
export class EtlModule {}
