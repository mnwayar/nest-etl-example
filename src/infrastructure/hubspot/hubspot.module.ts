import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RestClientService } from '../http/rest-client.service';
import { HubspotCompanyService } from './services/hubspot-company.service';
import { HubspotCompanyProviderToken } from '@core/application/companies/ports/hubspot-company.provider';
import { HubspotContactService } from './services/hubspot-contact.service';
import { HubspotContactProviderToken } from '@core/application/contacts/ports/hubspot-contact.provider';

@Module({
  imports: [HttpModule],
  providers: [
    RestClientService,
    HubspotCompanyService,
    {
      provide: HubspotCompanyProviderToken,
      useExisting: HubspotCompanyService,
    },
    HubspotContactService,
    {
      provide: HubspotContactProviderToken,
      useExisting: HubspotContactService,
    },
  ],
  exports: [
    HubspotCompanyProviderToken,
    HubspotContactProviderToken
  ],
})
export class HubspotModule {}
