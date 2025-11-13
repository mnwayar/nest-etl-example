import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ListAllCompaniesUseCase } from '../../../core/application/companies/usecases/list-all-companies.usecase';


@Controller('companies')
export class CompaniesController {
  constructor(private readonly listCompanies: ListAllCompaniesUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    const result = await this.listCompanies.execute();
    return result;
  }
}
