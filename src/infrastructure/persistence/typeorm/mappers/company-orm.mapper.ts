import { Company } from '@core/domain/companies/company.entity';
import { CompanyOrmEntity } from '../entities/company.orm-entity';
import {
  trimOrNull,
  trimLowerOrNull,
  normalizePhone,
  yearUtcOrNull,
} from '@shared/utils/normalizers';

export class CompanyOrmMapper {
  static toOrm(domain: Company): Partial<CompanyOrmEntity> {
    return {
      sourceId: domain.sourceId,
      name: trimOrNull(domain.name),
      websiteDomain: trimLowerOrNull(domain.websiteDomain),
      status: domain.status,
      phone: normalizePhone(domain.phone),
      city: trimLowerOrNull(domain.city),
      country: trimLowerOrNull(domain.country),
      industry: trimLowerOrNull(domain.industry),
      raw: domain.raw ?? null,
      sourceUrl: trimOrNull(domain.sourceUrl),
      sourceCreatedAt: domain.sourceCreatedAt ?? null,
      sourceUpdatedAt: domain.sourceUpdatedAt ?? null,
      sourceCreatedYear: yearUtcOrNull(domain.sourceCreatedAt),
    };
  }

  static toDomain(entity: CompanyOrmEntity): Company {
    return new Company(
      trimOrNull(entity.name),
      trimLowerOrNull(entity.websiteDomain),
      normalizePhone(entity.phone),
      trimLowerOrNull(entity.city),
      trimLowerOrNull(entity.country),
      trimLowerOrNull(entity.industry),
      entity.sourceId,
      entity.status,
      trimOrNull(entity.sourceUrl),
      entity.sourceCreatedAt,
      entity.sourceUpdatedAt,
      entity.raw ?? undefined,
    );
  }
}
