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
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SyncHubspotCompaniesUseCase {
  constructor(
    @Inject(CompanyRepositoryToken)
    private readonly companyRepository: CompanyRepository,

    @Inject(HubspotCompanyProviderToken)
    private readonly hubspotProvider: HubspotCompanyProvider,
  ) {}

  async execute(limit?: number): Promise<void> {
    const remoteCompanies = await this.hubspotProvider.fetchCompanies(limit);

    const companies: Company[] = remoteCompanies.map((company) => {
      return HubspotCompanyMapper.toDomain(company);
    });

    await this.companyRepository.sync(companies);
  }
}
