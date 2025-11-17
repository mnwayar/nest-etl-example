import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SyncHubspotUpdatedCompaniesUseCase } from '@core/application/companies/usecases/sync-hubspot-updated-companies.usecase';
import { SyncHubspotArchivedCompaniesUseCase } from '@core/application/companies/usecases/sync-hubspot-archived-companies.usecase';
import { SyncHubspotUpdatedContactsUseCase } from '@core/application/contacts/usecases/sync-hubspot-updated-contacts.usecase';
import { SyncHubspotArchivedContactsUseCase } from '@core/application/contacts/usecases/sync-hubspot-archived-contacts.usecase';
import { SyncHubspotUpdatedDealsUseCase } from '../../../core/application/deals/usecases/sync-hubspot-updated-deals.usecase';
import { SyncHubspotArchivedDealsUseCase } from '../../../core/application/deals/usecases/sync-hubspot-archived-deals.usecase';
import { SyncHubspotContactAssociationsUseCase } from '../../../core/application/associations/usecases/sync-hubspot-contact-associations.usecase';

@Controller('etl/hubspot')
export class EtlController {
  constructor(
    private readonly syncUpdatedCompanies: SyncHubspotUpdatedCompaniesUseCase,
    private readonly syncArchivedCompanies: SyncHubspotArchivedCompaniesUseCase,
    private readonly syncUpdatedContacts: SyncHubspotUpdatedContactsUseCase,
    private readonly syncArchivedContacts: SyncHubspotArchivedContactsUseCase,
    private readonly syncUpdatedDeals: SyncHubspotUpdatedDealsUseCase,
    private readonly syncArchivedDeals: SyncHubspotArchivedDealsUseCase,
    private readonly syncContactAssociations: SyncHubspotContactAssociationsUseCase,
  ) {}

  @Post('companies')
  @HttpCode(HttpStatus.OK)
  async syncCompaniesHandler() {
    await this.syncUpdatedCompanies.execute();
    return { ok: true };
  }

  @Post('companies/archived')
  @HttpCode(HttpStatus.OK)
  async syncCompaniesArchivedHandler() {
    await this.syncArchivedCompanies.execute();
    return { ok: true };
  }

  @Post('contacts')
  @HttpCode(HttpStatus.OK)
  async syncContactsHandler() {
    await this.syncUpdatedContacts.execute();
    return { ok: true };
  }

  @Post('contacts/archived')
  @HttpCode(HttpStatus.OK)
  async syncArchivedContactsHandler() {
    await this.syncArchivedContacts.execute();
    return { ok: true };
  }

  @Post('deals')
  @HttpCode(HttpStatus.OK)
  async syncDealsHandler() {
    await this.syncUpdatedDeals.execute();
    return { ok: true };
  }

  @Post('deals/archived')
  @HttpCode(HttpStatus.OK)
  async syncArchivedDealsHandler() {
    await this.syncArchivedDeals.execute();
    return { ok: true };
  }

  @Post('associations')
  @HttpCode(HttpStatus.OK)
  async syncAssociationsHandler() {
    await this.syncContactAssociations.execute();
    return { ok: true };
  }
}
