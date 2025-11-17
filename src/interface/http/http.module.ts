import { Module } from '@nestjs/common';
import { EtlController } from './etl/etl.controller';
import { EtlModule } from '@infra/etl/etl.module';
import { CompaniesHttpModule } from './companies/companies.http.module';
import { ContactsHttpModule } from './contacts/contacts.http.module';
import { DealsHttpModule } from './deals/deals.http.module';

@Module({
  imports: [
    EtlModule,
    CompaniesHttpModule,
    ContactsHttpModule,
    DealsHttpModule,
  ],
  controllers: [EtlController],
})
export class HttpModule {}
