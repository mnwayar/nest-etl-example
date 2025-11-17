import { NestFactory } from '@nestjs/core';
import { EtlRunnerModule } from './etl-runner.module';
import { SyncHubspotArchivedCompaniesUseCase } from '@core/application/companies/usecases/sync-hubspot-archived-companies.usecase';
import { SyncHubspotUpdatedCompaniesUseCase } from '@core/application/companies/usecases/sync-hubspot-updated-companies.usecase';
import { SyncHubspotArchivedContactsUseCase } from '@core/application/contacts/usecases/sync-hubspot-archived-contacts.usecase';
import { SyncHubspotUpdatedContactsUseCase } from '@core/application/contacts/usecases/sync-hubspot-updated-contacts.usecase';
import { SyncHubspotArchivedDealsUseCase } from '@core/application/deals/usecases/sync-hubspot-archived-deals.usecase';
import { SyncHubspotUpdatedDealsUseCase } from '@core/application/deals/usecases/sync-hubspot-updated-deals.usecase';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('ETL-Runner');
  const app = await NestFactory.createApplicationContext(EtlRunnerModule);

  const [, , command] = process.argv;

  try {
    switch (command) {
      // ----------------- COMPANIES ------------------
      case 'companies': {
        logger.log('Running ETL: companies (updated)');
        const usecase = app.get(SyncHubspotUpdatedCompaniesUseCase);
        await usecase.execute();
        break;
      }
      case 'companies:deleted': {
        logger.log('Running ETL: companies (deleted/archived)');
        const usecase = app.get(SyncHubspotArchivedCompaniesUseCase);
        await usecase.execute();
        break;
      }
      // -----------------  CONTACTS  -----------------
      case 'contacts': {
        logger.log('Running ETL: contacts (updated)');
        const usecase = app.get(SyncHubspotUpdatedContactsUseCase);
        await usecase.execute();
        break;
      }
      case 'contacts:deleted': {
        logger.log('Running ETL: contacts (deleted/archived)');
        const usecase = app.get(SyncHubspotArchivedContactsUseCase);
        await usecase.execute();
        break;
      }
      // -----------------   DEALS -  -----------------
      case 'deals': {
        logger.log('Running ETL: deals (updated)');
        const usecase = app.get(SyncHubspotUpdatedDealsUseCase);
        await usecase.execute();
        break;
      }
      case 'deals:deleted': {
        logger.log('Running ETL: deals (deleted/archived)');
        const usecase = app.get(SyncHubspotArchivedDealsUseCase);
        await usecase.execute();
        break;
      }
      default: {
        logger.log(
          'Running ETL: ALL (companies/contacts/deals updated + deleted)',
        );
        const updatedCompanies = app.get(SyncHubspotUpdatedCompaniesUseCase);
        const archivedCompanies = app.get(SyncHubspotArchivedCompaniesUseCase);

        const updatedContacts = app.get(SyncHubspotUpdatedContactsUseCase);
        const archivedContacts = app.get(SyncHubspotArchivedContactsUseCase);

        const updatedDeals = app.get(SyncHubspotUpdatedDealsUseCase);
        const archivedDeals = app.get(SyncHubspotArchivedDealsUseCase);

        await updatedCompanies.execute();
        await archivedCompanies.execute();
        await updatedContacts.execute();
        await archivedContacts.execute();
        await updatedDeals.execute();
        await archivedDeals.execute();

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
