import {
  Company,
  CompanyContactSummary,
} from '@core/domain/companies/company.entity';
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
      sourceStatus: domain.sourceStatus,
      phone: normalizePhone(domain.phone),
      city: trimLowerOrNull(domain.city),
      country: trimLowerOrNull(domain.country),
      industry: trimLowerOrNull(domain.industry),
      raw: domain.raw ?? null,
      sourceUrl: trimOrNull(domain.sourceUrl),
      sourceCreatedAt: domain.sourceCreatedAt ?? null,
      sourceUpdatedAt: domain.sourceUpdatedAt ?? null,
      sourceArchivedAt: domain.sourceArchivedAt ?? null,
      sourceCreatedYear: yearUtcOrNull(domain.sourceCreatedAt),
    };
  }

  static toDomain(entity: CompanyOrmEntity): Company {
    const contacts =
      entity.contactAssociations?.reduce<CompanyContactSummary[]>(
        (list, association) => {
          const contact = association.contact;
          if (!contact) {
            return list;
          }

          list.push({
            id: contact.sourceId,
            firstname: contact.firstname,
            lastname: contact.lastname,
          });

          return list;
        },
        [],
      ) ?? [];

    return new Company(
      trimOrNull(entity.name),
      trimLowerOrNull(entity.websiteDomain),
      normalizePhone(entity.phone),
      trimLowerOrNull(entity.city),
      trimLowerOrNull(entity.country),
      trimLowerOrNull(entity.industry),
      entity.sourceId,
      entity.sourceStatus,
      trimOrNull(entity.sourceUrl),
      entity.sourceCreatedAt,
      entity.sourceUpdatedAt,
      entity.sourceArchivedAt,
      entity.raw ?? undefined,
      contacts,
    );
  }
}
