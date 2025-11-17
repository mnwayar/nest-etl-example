import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RestClientService } from '../http/rest-client.service';
import { HubspotCompanyService } from './services/hubspot-company.service';
import { HubspotCompanyProviderToken } from '@core/application/companies/ports/hubspot-company.provider';
import { HubspotContactService } from './services/hubspot-contact.service';
import { HubspotContactProviderToken } from '@core/application/contacts/ports/hubspot-contact.provider';
import { HubspotDealProviderToken } from '@core/application/deals/ports/hubspot-deal.provider';
import { HubspotDealService } from './services/hubspot-deal.service';

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
    HubspotDealService,
    {
      provide: HubspotDealProviderToken,
      useExisting: HubspotDealService,
    },
  ],
  exports: [
    HubspotCompanyProviderToken,
    HubspotContactProviderToken,
    HubspotDealProviderToken,
  ],
})
export class HubspotModule {}
