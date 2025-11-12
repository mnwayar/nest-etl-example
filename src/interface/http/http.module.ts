import { Module } from '@nestjs/common';
import { EtlController } from './controllers/etl.controller';
import { EtlModule } from '../../infrastructure/etl/etl.module';
import { CompaniesController } from './controllers/companies.controller';

@Module({
  imports: [
    EtlModule,
  ],
  controllers: [EtlController, CompaniesController],
})
export class HttpModule {}
