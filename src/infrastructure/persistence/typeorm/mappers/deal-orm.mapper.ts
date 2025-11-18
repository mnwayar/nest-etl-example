import { Deal, DealContactSummary } from '@core/domain/deals/deal.entity';
import { DealOrmEntity } from '../entities/deal.orm-entity';
import {
  trimOrNull,
  trimLowerOrNull,
  yearUtcOrNull,
} from '@shared/utils/normalizers';

export class DealOrmMapper {
  static toOrm(domain: Deal): Partial<DealOrmEntity> {
    return {
      sourceId: domain.sourceId,
      sourceUrl: trimOrNull(domain.sourceUrl),
      sourceCreatedAt: domain.sourceCreatedAt ?? null,
      sourceUpdatedAt: domain.sourceUpdatedAt ?? null,
      sourceArchivedAt: domain.sourceArchivedAt ?? null,
      sourceCreatedYear: yearUtcOrNull(domain.sourceCreatedAt),
      raw: domain.raw ?? null,
      name: trimOrNull(domain.name),
      stage: trimLowerOrNull(domain.stage),
      amount: trimOrNull(domain.amount),
      closeDate: domain.closeDate,
    };
  }

  static toDomain(entity: DealOrmEntity): Deal {
    const contacts =
      entity.contactAssociations?.reduce<DealContactSummary[]>(
        (list, association) => {
          if (association.targetType !== 'DEAL') {
            return list;
          }

          const contact = association.contact;

          list.push({
            id: contact.sourceId,
            firstname: trimOrNull(contact.firstname),
            lastname: trimOrNull(contact.lastname),
          });

          return list;
        },
        [],
      ) ?? [];

    return new Deal(
      trimOrNull(entity.name),
      trimLowerOrNull(entity.stage),
      entity.closeDate,
      trimOrNull(entity.amount),
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
