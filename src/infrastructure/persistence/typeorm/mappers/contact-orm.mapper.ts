import {
  Contact,
  ContactCompanySummary,
  ContactDealSummary,
} from '@core/domain/contacts/contact.entity';
import { ContactOrmEntity } from '../entities/contact.orm-entity';
import {
  trimOrNull,
  trimLowerOrNull,
  normalizePhone,
  yearUtcOrNull,
} from '@shared/utils/normalizers';

export class ContactOrmMapper {
  static toOrm(domain: Contact): Partial<ContactOrmEntity> {
    return {
      sourceId: domain.sourceId,
      firstname: trimOrNull(domain.firstname),
      lastname: trimOrNull(domain.lastname),
      email: trimOrNull(domain.email),
      phone: normalizePhone(domain.phone),
      sourceStatus: domain.sourceStatus,
      raw: domain.raw ?? null,
      sourceUrl: trimOrNull(domain.sourceUrl),
      sourceCreatedAt: domain.sourceCreatedAt ?? null,
      sourceUpdatedAt: domain.sourceUpdatedAt ?? null,
      sourceArchivedAt: domain.sourceArchivedAt ?? null,
      sourceCreatedYear: yearUtcOrNull(domain.sourceCreatedAt),
    };
  }

  static toDomain(entity: ContactOrmEntity): Contact {
    const associations = entity.contactAssociations ?? [];
    const companies = associations.reduce<ContactCompanySummary[]>(
      (result, association) => {
        if (association.targetType !== 'COMPANY') {
          return result;
        }

        const id = association.company?.sourceId ?? null;
        if (!id) {
          return result;
        }

        result.push({
          id,
          name: trimOrNull(association.company?.name ?? null),
        });

        return result;
      },
      [],
    );

    const deals = associations.reduce<ContactDealSummary[]>(
      (result, association) => {
        if (association.targetType !== 'DEAL') {
          return result;
        }

        const id = association.deal?.sourceId ?? null;
        if (!id) {
          return result;
        }

        result.push({
          id,
          name: trimOrNull(association.deal?.name ?? null),
        });

        return result;
      },
      [],
    );

    return new Contact(
      trimLowerOrNull(entity.email),
      trimOrNull(entity.firstname),
      trimOrNull(entity.lastname),
      normalizePhone(entity.phone),
      entity.sourceId,
      entity.sourceStatus,
      trimOrNull(entity.sourceUrl),
      entity.sourceCreatedAt,
      entity.sourceUpdatedAt,
      entity.sourceArchivedAt,
      entity.raw ?? undefined,
      companies,
      deals,
    );
  }
}
