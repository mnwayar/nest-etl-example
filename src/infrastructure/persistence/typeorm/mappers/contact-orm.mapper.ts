import { Contact } from '@core/domain/contacts/contact.entity';
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
      status: domain.status,
      raw: domain.raw ?? null,
      sourceUrl: trimOrNull(domain.sourceUrl),
      sourceCreatedAt: domain.sourceCreatedAt ?? null,
      sourceUpdatedAt: domain.sourceUpdatedAt ?? null,
      sourceCreatedYear: yearUtcOrNull(domain.sourceCreatedAt),
    };
  }

  static toDomain(entity: ContactOrmEntity): Contact {
    return new Contact(
      trimLowerOrNull(entity.email),
      trimOrNull(entity.firstname),
      trimOrNull(entity.lastname),
      normalizePhone(entity.phone),
      entity.sourceId,
      entity.status,
      trimOrNull(entity.sourceUrl),
      entity.sourceCreatedAt,
      entity.sourceUpdatedAt,
      entity.raw ?? undefined,
    );
  }
}
