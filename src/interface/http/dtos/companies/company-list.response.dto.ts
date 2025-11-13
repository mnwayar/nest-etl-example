import { Company } from '../../../../core/domain/companies/company.entity';

export class CompanyListResponseDto {
  id!: string;
  name!: string | null;
  websiteDomain!: string | null;
  status!: string | null;
  url!: string | null;
  createdAt!: Date | null;
  updatedAt!: Date | null;

  static fromDomain(company: Company): CompanyListResponseDto {
    const dto = new CompanyListResponseDto();

    dto.id = company.sourceId;
    dto.name = company.name;
    dto.websiteDomain = company.websiteDomain ?? null;
    dto.status = company.status ?? null;
    dto.url = company.sourceUrl ?? null;
    dto.createdAt = company.sourceCreatedAt ?? null;
    dto.updatedAt = company.sourceUpdatedAt ?? null;

    return dto;
  }
}
