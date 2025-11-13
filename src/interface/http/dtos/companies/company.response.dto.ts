import { Company } from '../../../../core/domain/companies/company.entity';

export class CompanyResponseDto {
  id!: string;
  name!: string | null;
  websiteDomain!: string | null;
  status!: string | null;
  phone!: string | null;
  city!: string | null;
  country!: string | null;
  industry!: string | null;
  url!: string | null;
  createdAt!: Date | null;
  updatedAt!: Date | null;

  static fromDomain(company: Company): CompanyResponseDto {
    const dto = new CompanyResponseDto();

    dto.id = company.sourceId;
    dto.name = company.name;
    dto.websiteDomain = company.websiteDomain ?? null;
    dto.status = company.status ?? null;
    dto.phone = company.phone ?? null;
    dto.city = company.city ?? null;
    dto.country = company.country ?? null;
    dto.industry = company.industry ?? null;
    dto.url = company.sourceUrl ?? null;
    dto.createdAt = company.sourceCreatedAt ?? null;
    dto.updatedAt = company.sourceUpdatedAt ?? null;

    return dto;
  }
}
