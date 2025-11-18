import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListAllCompaniesUseCase } from '@core/application/companies/usecases/list-all-companies.usecase';
import { GetCompanyDetailsUseCase } from '@core/application/companies/usecases/get-company-details.usecase';
import { CompanyListResponseDto } from '../dtos/companies/company-list.response.dto';
import { CompanyResponseDto } from '../dtos/companies/company.response.dto';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly listCompanies: ListAllCompaniesUseCase,
    private readonly getCompanyDetails: GetCompanyDetailsUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CompanyListResponseDto, isArray: true })
  async getAll() {
    const companies = await this.listCompanies.execute();
    return companies.map((c) => CompanyListResponseDto.fromDomain(c));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CompanyResponseDto })
  async findOne(@Param('id') id: string) {
    const company = await this.getCompanyDetails.execute(id);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return CompanyResponseDto.fromDomain(company);
  }
}
