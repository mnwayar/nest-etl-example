import { Inject, Injectable } from '@nestjs/common';
import {
  CompanyRepository,
  CompanyRepositoryToken,
} from '@core/domain/companies/company.repository';
import { Company } from '@core/domain/companies/company.entity';
import { ListAllEntitiesUseCase } from '../../shared/usecases/list-all-entities.usecase';

@Injectable()
export class ListAllCompaniesUseCase extends ListAllEntitiesUseCase<Company> {
  constructor(
    @Inject(CompanyRepositoryToken)
    companyRepository: CompanyRepository,
  ) {
    super(companyRepository);
  }
}
