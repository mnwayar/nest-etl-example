import { NestFactory } from '@nestjs/core';
import { EtlRunnerModule } from './etl-runner.module';
import { SyncHubspotCompaniesUseCase } from '../../../src/core/application/companies/usecases/sync-hubspot-companies.usecase';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(EtlRunnerModule);
  const usecase = app.get(SyncHubspotCompaniesUseCase);
  await usecase.execute();
  await app.close();
}
bootstrap();
