import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HubspotContactAssociationProvider,
  HubspotContactAssociationProviderToken,
} from '../ports/hubspot-contact-association.provider';
import { HubspotContactAssociationMapper } from '../mappers/hubspot-contact-association.mapper';
import {
  ContactAssociationRepositoryToken,
  ContactAssociationRepository,
} from '../../../domain/associations/repositories/contact-association.repository';
import {
  ContactRepositoryToken,
  ContactRepository,
} from '../../../domain/contacts/contact.repository';
import { ContactAssociation } from '../../../domain/associations/entities/contact-association.entity';

interface SyncContactAssociationsParams {
  since?: Date | null;
  batchSize?: number | null;
}

@Injectable()
export class SyncHubspotContactAssociationsUseCase {
  private readonly logger = new Logger(
    SyncHubspotContactAssociationsUseCase.name,
  );

  private readonly DEFAULT_BATCH_SIZE = 1000;

  constructor(
    @Inject(ContactRepositoryToken)
    private readonly contactRepository: ContactRepository,

    @Inject(HubspotContactAssociationProviderToken)
    private readonly associationProvider: HubspotContactAssociationProvider,

    @Inject(ContactAssociationRepositoryToken)
    private readonly associationRepository: ContactAssociationRepository,

    private readonly configService: ConfigService,
  ) {}

  private chunk<T>(items: readonly T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
      result.push(items.slice(i, i + size));
    }
    return result;
  }

  private resolveBatchSize(override?: number | null): number {
    if (override && override > 0) {
      return override;
    }

    const fromConfig = this.configService.get<number>('hubspot.batchSize');

    if (fromConfig && fromConfig > 0) {
      return fromConfig;
    }

    return this.DEFAULT_BATCH_SIZE;
  }

  async execute(params: SyncContactAssociationsParams = {}): Promise<void> {
    const { since = null, batchSize = null } = params;

    const effectiveBatchSize = this.resolveBatchSize(batchSize);

    const contactSourceIds =
      await this.contactRepository.listSourceIdsUpdatedSince(since);

    if (!contactSourceIds.length) {
      this.logger.log('SyncContactAssociations: no contacts to process');
      return;
    }

    const batches = this.chunk(contactSourceIds, effectiveBatchSize);

    this.logger.log(
      `SyncContactAssociations: processing ${contactSourceIds.length.toString()} contacts in ${batches.length.toString()} batches (batchSize=${effectiveBatchSize.toString()})`,
    );

    for (const [index, batch] of batches.entries()) {
      this.logger.debug(
        `SyncContactAssociations: batch ${(index + 1).toString()}/${batches.length.toString()} (${batch.length.toString()} contacts)`,
      );

      const { companies, deals } =
        await this.associationProvider.fetchAssociationsForContacts(batch);

      const companyAssociations: ContactAssociation[] =
        HubspotContactAssociationMapper.toDomain(companies, 'COMPANY');

      const dealAssociations: ContactAssociation[] =
        HubspotContactAssociationMapper.toDomain(deals, 'DEAL');

      const allAssociations: ContactAssociation[] = [
        ...companyAssociations,
        ...dealAssociations,
      ];

      if (!allAssociations.length) {
        this.logger.debug(
          `SyncContactAssociations: batch ${(index + 1).toString()} → no associations`,
        );
        continue;
      }

      await this.associationRepository.upsertManyFromSource(allAssociations);

      this.logger.debug(
        `SyncContactAssociations: batch ${(index + 1).toString()} → persisted ${allAssociations.length.toString()} associations`,
      );
    }

    this.logger.log('SyncContactAssociations: completed successfully');
  }
}
