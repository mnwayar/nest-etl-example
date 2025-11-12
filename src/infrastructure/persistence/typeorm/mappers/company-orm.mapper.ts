import { Company } from '../../../../core/domain/companies/company.entity';
import { CompanyOrmEntity } from '../entities/company.orm-entity';
import {
  trimOrNull,
  trimLowerOrNull,
  normalizePhone,
  yearUtcOrNull,
} from '../../../../shared/utils/normalizers';

export class CompanyOrmMapper {
  static toOrm(domain: Company): Partial<CompanyOrmEntity> {
    const rawProps = domain.raw?.properties ?? {};

    return {
      sourceId: domain.sourceId,
      name: trimOrNull(domain.name as string | null),
      websiteDomain: trimLowerOrNull(domain.websiteDomain as string | null),
      status: domain.status,
      phone: normalizePhone(rawProps.phone as string | null),
      city: trimLowerOrNull(rawProps.city as string | null),
      country: trimLowerOrNull(rawProps.country as string | null),
      industry: trimLowerOrNull(rawProps.industry as string | null),
      raw: domain.raw ?? null,
      sourceUrl: trimOrNull(domain.raw?.url as string | null),
      sourceCreatedAt: domain.sourceCreatedAt ?? null,
      sourceUpdatedAt: domain.sourceUpdatedAt ?? null,
      sourceCreatedYear: yearUtcOrNull(domain.sourceCreatedAt)
    };
  }
}
