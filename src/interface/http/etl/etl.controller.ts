import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SyncHubspotCompaniesUseCase } from '@core/application/companies/usecases/sync-hubspot-companies.usecase';

@Controller('etl/hubspot')
export class EtlController {
  constructor(
    private readonly syncCompanies: SyncHubspotCompaniesUseCase,
  ) {}

  @Post('companies')
  @HttpCode(HttpStatus.OK)
  async syncCompaniesHandler() {
    await this.syncCompanies.execute();
    return { ok: true };
  }
}
