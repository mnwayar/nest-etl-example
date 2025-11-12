import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CompanyTypeOrmRepository } from '../../../infrastructure/persistence/repositories/company.typeorm.repository';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesRepository: CompanyTypeOrmRepository) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async listAll() {
    const rows = await this.companiesRepository.findAll();
    return { data: rows };
  }
}
