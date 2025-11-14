import { NestFactory } from '@nestjs/core';
import { EtlRunnerModule } from './etl-runner.module';
import { SyncHubspotCompaniesUseCase } from '@core/application/companies/usecases/sync-hubspot-companies.usecase';
import { SyncHubspotContactsUseCase } from '@core/application/contacts/usecases/sync-hubspot-contacts.usecase';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(EtlRunnerModule);
  const companiesUsecase = app.get(SyncHubspotCompaniesUseCase);
  await companiesUsecase.execute();

  const contactsUsecase = app.get(SyncHubspotContactsUseCase);
  await contactsUsecase.execute();

  await app.close();
}
bootstrap().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
