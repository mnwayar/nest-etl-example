import { Inject, Injectable } from '@nestjs/common';
import {
  CompanyRepository,
  CompanyRepositoryToken,
} from '@core/domain/companies/company.repository';
import { Company } from '@core/domain/companies/company.entity';
import { GetEntityDetailsUseCase } from '../../shared/usecases/get-entity-details.usecase';

@Injectable()
export class GetCompanyDetailsUseCase extends GetEntityDetailsUseCase<Company> {
  constructor(
    @Inject(CompanyRepositoryToken)
    companyRepository: CompanyRepository,
  ) {
    super(companyRepository, 'Company');
  }
}
