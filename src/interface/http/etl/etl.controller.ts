import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SyncHubspotCompaniesUseCase } from '@core/application/companies/usecases/sync-hubspot-companies.usecase';
import { SyncHubspotContactsUseCase } from '@core/application/contacts/usecases/sync-hubspot-contacts.usecase';

@Controller('etl/hubspot')
export class EtlController {
  constructor(
    private readonly syncCompanies: SyncHubspotCompaniesUseCase,
    private readonly syncContacts: SyncHubspotContactsUseCase,
  ) {}

  @Post('companies')
  @HttpCode(HttpStatus.OK)
  async syncCompaniesHandler() {
    await this.syncCompanies.execute();
    return { ok: true };
  }

  @Post('contacts')
  @HttpCode(HttpStatus.OK)
  async syncContactsHandler() {
    await this.syncContacts.execute();
    return { ok: true };
  }
}
