import { Inject, Injectable } from '@nestjs/common';
import {
  CompanyRepository,
  CompanyRepositoryToken,
} from '@core/domain/companies/company.repository';
import { Company } from '@core/domain/companies/company.entity';

@Injectable()
export class GetCompanyDetailsUseCase {
  constructor(
    @Inject(CompanyRepositoryToken)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(id: string): Promise<Company | null> {
    return this.companyRepository.getById(id);
  }
}
