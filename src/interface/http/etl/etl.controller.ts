import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SyncHubspotCompaniesUpdatedUseCase } from '@core/application/companies/usecases/sync-hubspot-companies-updated.usecase';
import { SyncHubspotCompaniesArchivedUseCase } from '@core/application/companies/usecases/sync-hubspot-companies-archived.usecase';
import { SyncHubspotContactsUseCase } from '@core/application/contacts/usecases/sync-hubspot-contacts.usecase';

@Controller('etl/hubspot')
export class EtlController {
  constructor(
    private readonly syncArchivedCompanies: SyncHubspotCompaniesArchivedUseCase,
    private readonly syncUpdatedCompanies: SyncHubspotCompaniesUpdatedUseCase,
    private readonly syncContacts: SyncHubspotContactsUseCase,
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
    await this.syncContacts.execute();
    return { ok: true };
  }
}
