import { NestFactory } from '@nestjs/core';
import { EtlRunnerModule } from './etl-runner.module';
import { SyncHubspotCompaniesArchivedUseCase } from '@core/application/companies/usecases/sync-hubspot-companies-archived.usecase';
import { SyncHubspotCompaniesUpdatedUseCase } from '@core/application/companies/usecases/sync-hubspot-companies-updated.usecase';
import { SyncHubspotContactsUseCase } from '@core/application/contacts/usecases/sync-hubspot-contacts.usecase';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('ETL-Runner');
  const app = await NestFactory.createApplicationContext(EtlRunnerModule);

  const [, , command] = process.argv;

  try {
    switch (command) {
      // ----------------- COMPANIES -----------------
      case 'companies': {
        logger.log('Running ETL: companies (updated)');
        const usecase = app.get(SyncHubspotCompaniesUpdatedUseCase);
        await usecase.execute();
        break;
      }
      case 'companies:deleted': {
        logger.log('Running ETL: companies (deleted/archived)');
        const usecase = app.get(SyncHubspotCompaniesArchivedUseCase);
        await usecase.execute();
        break;
      }
      case 'contacts': {
        logger.log('Running ETL: contacts (updated)');
        const usecase = app.get(SyncHubspotContactsUseCase);
        await usecase.execute();
        break;
      }
      default: {
        logger.log('Running ETL: ALL (companies updated + deleted)');
        const companiesUpdated = app.get(SyncHubspotCompaniesUpdatedUseCase);
        const companiesDeleted = app.get(SyncHubspotCompaniesArchivedUseCase);
        const contactsUsecase = app.get(SyncHubspotContactsUseCase);

        await companiesUpdated.execute();
        await companiesDeleted.execute();
        await contactsUsecase.execute();
        // cuando tengas contacts/deals, los agregás acá:
        // const contactsUpdated = appContext.get(SyncHubspotContactsUpdatedUseCase);
        // const contactsDeleted = appContext.get(SyncHubspotContactsDeletedUseCase);
        // const dealsUpdated = appContext.get(SyncHubspotDealsUpdatedUseCase);
        // const dealsDeleted = appContext.get(SyncHubspotDealsDeletedUseCase);
        //
        // await contactsUpdated.execute();
        // await contactsDeleted.execute();
        // await dealsUpdated.execute();
        // await dealsDeleted.execute();

        break;
      }
    }
    logger.log('ETL finished successfully');
  } catch (error) {
    logger.error('ETL failed with error: ', error as any);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}
bootstrap().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
