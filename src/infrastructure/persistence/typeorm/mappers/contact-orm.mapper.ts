import { Contact } from '@core/domain/contacts/contact.entity';
import { ContactOrmEntity } from '../entities/contact.orm-entity';
import { trimOrNull, trimLowerOrNull, normalizePhone, yearUtcOrNull } from '@shared/utils/normalizers';

export class ContactOrmMapper {
  static toOrm(domain: Contact): Partial<ContactOrmEntity> {
    
    return {
      sourceId: domain.sourceId,
      firstname: trimOrNull(domain.firstname as string | null),
      lastname: trimOrNull(domain.lastname as string | null),
      email: trimOrNull(domain.email as string | null),
      phone: normalizePhone(domain.phone as string | null),
      status: domain.status,
      raw: domain.raw ?? null,
      sourceUrl: trimOrNull(domain.sourceUrl as string | null),
      sourceCreatedAt: domain.sourceCreatedAt ?? null,
      sourceUpdatedAt: domain.sourceUpdatedAt ?? null,
      sourceCreatedYear: yearUtcOrNull(domain.sourceCreatedAt)
    };
  }

  static toDomain(entity: ContactOrmEntity): Contact {
    return new Contact(
      entity.sourceId,
      trimLowerOrNull(entity.email),
      trimOrNull(entity.firstname),
      trimOrNull(entity.lastname),
      normalizePhone(entity.phone),
      entity.status,
      trimOrNull(entity.sourceUrl),
      entity.sourceCreatedAt,
      entity.sourceUpdatedAt,
      entity.raw ?? undefined,
    );
  }
}
