import { Company } from '@core/domain/companies/company.entity';
import { CompanyOrmEntity } from '../entities/company.orm-entity';
import { trimOrNull, trimLowerOrNull, normalizePhone, yearUtcOrNull } from '@shared/utils/normalizers';

export class CompanyOrmMapper {
  static toOrm(domain: Company): Partial<CompanyOrmEntity> {
    
    return {
      sourceId: domain.sourceId,
      name: trimOrNull(domain.name as string | null),
      websiteDomain: trimLowerOrNull(domain.websiteDomain as string | null),
      status: domain.status,
      phone: normalizePhone(domain.phone as string | null),
      city: trimLowerOrNull(domain.city as string | null),
      country: trimLowerOrNull(domain.country as string | null),
      industry: trimLowerOrNull(domain.industry as string | null),
      raw: domain.raw ?? null,
      sourceUrl: trimOrNull(domain.sourceUrl as string | null),
      sourceCreatedAt: domain.sourceCreatedAt ?? null,
      sourceUpdatedAt: domain.sourceUpdatedAt ?? null,
      sourceCreatedYear: yearUtcOrNull(domain.sourceCreatedAt)
    };
  }

  static toDomain(entity: CompanyOrmEntity): Company {
    return new Company(
      entity.sourceId,
      trimOrNull(entity.name),
      trimLowerOrNull(entity.websiteDomain),
      normalizePhone(entity.phone),
      trimLowerOrNull(entity.city),
      trimLowerOrNull(entity.country),
      trimLowerOrNull(entity.industry),
      entity.status,
      trimOrNull(entity.sourceUrl),
      entity.sourceCreatedAt,
      entity.sourceUpdatedAt,
      entity.raw ?? undefined,
    );
  }
}
