import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RestClientService } from '../http/rest-client.service';
import { HubspotCompanyService } from './services/hubspot-company.service';
import { HubspotCompanyProviderToken } from '@core/application/companies/ports/hubspot-company.provider';

@Module({
  imports: [HttpModule],
  providers: [
    RestClientService,
    HubspotCompanyService,
    {
      provide: HubspotCompanyProviderToken,
      useExisting: HubspotCompanyService,
    },
  ],
  exports: [HubspotCompanyProviderToken],
})
export class HubspotModule {}
