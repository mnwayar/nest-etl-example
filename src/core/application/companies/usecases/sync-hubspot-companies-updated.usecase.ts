import { Inject, Injectable } from '@nestjs/common';
import { Company } from '@core/domain/companies/company.entity';
import {
  CompanyRepository,
  CompanyRepositoryToken,
} from '@core/domain/companies/company.repository';
import {
  HubspotCompanyProvider,
  HubspotCompanyProviderToken,
} from '../ports/hubspot-company.provider';
import { HubspotCompanyMapper } from '../mappers/hubspot-company.mapper';
import { HubspotCompanyRaw } from '../types/hubspot-company.type';
import { SyncHubspotEntityUsecase } from '../../shared/usecases/sync-hubspot-entity.usecase';
import {
  CrmObjectType,
  CrmSyncCheckpoint,
} from '../../../domain/shared/entities/crm-sync-checkpoint.entity';
import {
  CrmSyncCheckpointRepository,
  CrmSyncCheckpointRepositoryToken,
} from '../../../domain/shared/repositories/crm-sync-checkpoint.repository';
import { HubspotSearchFilter } from '../../shared/types/hubspot-search-filter.type';

@Injectable()
export class SyncHubspotCompaniesUpdatedUseCase extends SyncHubspotEntityUsecase<
  Company,
  HubspotCompanyRaw
> {
  constructor(
    @Inject(CompanyRepositoryToken)
    companyRepository: CompanyRepository,

    @Inject(HubspotCompanyProviderToken)
    private readonly hubspotProvider: HubspotCompanyProvider,

    @Inject(CrmSyncCheckpointRepositoryToken)
    private readonly crmSyncRepository: CrmSyncCheckpointRepository,
  ) {
    super(companyRepository);
  }

  private syncObjectType: CrmObjectType = 'COMPANY';
  private filters: HubspotSearchFilter[] = [];

  protected async beforeExecute(): Promise<void> {
    const last: CrmSyncCheckpoint | null =
      await this.crmSyncRepository.getLastSyncByObjectType(this.syncObjectType);
    const lastRunAt: number = last?.lastRunAt.getTime() ?? 0;

    this.filters = [
      {
        propertyName: 'hs_lastmodifieddate',
        operator: 'GT',
        value: lastRunAt,
      },
    ];
  }

  protected async fetchFromHubspot(
    limit?: number,
  ): Promise<HubspotCompanyRaw[]> {
    return this.hubspotProvider.fetchUpdatedCompanies(limit, this.filters);
  }

  protected mapToDomain(raw: HubspotCompanyRaw): Company {
    return HubspotCompanyMapper.toDomain(raw);
  }

  protected async afterExecute(_entities: Company[]): Promise<void> {
    if (!_entities.length) return;

    let lastModifiedDate: Date = _entities[0].sourceUpdatedAt ?? new Date();
    _entities.map((entity: Company) => {
      if (entity.sourceUpdatedAt && entity.sourceUpdatedAt > lastModifiedDate) {
        lastModifiedDate = entity.sourceUpdatedAt;
      }
    });

    //last modified date - 1 min, just to avoid miss changes
    lastModifiedDate = new Date(lastModifiedDate.getTime() - 60_000);

    await this.crmSyncRepository.createNewSync(
      this.syncObjectType,
      lastModifiedDate,
    );
  }
}
