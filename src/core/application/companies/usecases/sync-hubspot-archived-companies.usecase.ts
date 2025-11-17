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
import { SyncHubspotEntityUseCase } from '../../shared/usecases/sync-hubspot-entity.usecase';

@Injectable()
export class SyncHubspotArchivedCompaniesUseCase extends SyncHubspotEntityUseCase<
  Company,
  HubspotCompanyRaw
> {
  constructor(
    @Inject(CompanyRepositoryToken)
    companyRepository: CompanyRepository,

    @Inject(HubspotCompanyProviderToken)
    private readonly hubspotProvider: HubspotCompanyProvider,
  ) {
    super(companyRepository);
  }

  protected fetchFromHubspot(limit?: number): Promise<HubspotCompanyRaw[]> {
    return this.hubspotProvider.fetchArchivedCompanies(limit);
  }

  protected mapToDomain(raw: HubspotCompanyRaw): Company {
    return HubspotCompanyMapper.toDomain(raw);
  }
}
