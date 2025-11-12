import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RestClientService } from '../http/rest-client.service';
import { HubspotCompanyService } from './services/hubspot-company.service';

@Module({
  imports: [HttpModule],
  providers: [RestClientService, HubspotCompanyService],
  exports: [HubspotCompanyService],
})
export class HubspotModule {}
