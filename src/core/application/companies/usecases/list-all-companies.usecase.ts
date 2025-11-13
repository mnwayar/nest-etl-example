import { Inject, Injectable } from '@nestjs/common';
import {
  CompanyRepository,
  CompanyRepositoryToken,
} from '../../../domain/companies/company.repository';
import { Company } from '@core/domain/companies/company.entity';

@Injectable()
export class ListAllCompaniesUseCase {
  constructor(
    @Inject(CompanyRepositoryToken)
    private readonly companyRepository: CompanyRepository
  ) {}

  async execute():Promise<Company[]> {
    return this.companyRepository.getAll();
  }
}
