import { Company } from '../../../domain/companies/company.entity';
import { CompanyRepository } from '../../../domain/companies/company.repository';
import { HubspotCompanyProvider } from '../ports/hubspot-company.provider';
import { HubspotCompanyMapper } from '../mappers/hubspot-company.mapper';

export class SyncHubspotCompaniesUseCase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly hubspotProvider: HubspotCompanyProvider,
  ) {}

  async execute(limit?: number): Promise<void> {
    const remoteCompanies = await this.hubspotProvider.fetchCompanies(limit);

    const companies = remoteCompanies.map((company) => {
      return HubspotCompanyMapper.toDomain(company);
    });

    await this.companyRepository.sync(companies);
  }
}
