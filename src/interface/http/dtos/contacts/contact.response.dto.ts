import { Contact } from '@core/domain/contacts/contact.entity';

export class ContactResponseDto {
  id!: string;
  email!: string | null;
  firstname!: string | null;
  lastname!: string | null;
  phone!: string | null;
  status!: string | null;
  url!: string | null;
  createdAt!: Date | null;
  updatedAt!: Date | null;

  static fromDomain(contact: Contact): ContactResponseDto {
    const dto = new ContactResponseDto();

    dto.id = contact.sourceId;
    dto.email = contact.email ?? null;
    dto.firstname = contact.firstname ?? null;
    dto.lastname = contact.lastname ?? null;
    dto.phone = contact.phone ?? null;
    dto.status = contact.status ?? null;
    dto.phone = contact.phone ?? null;
    dto.url = contact.sourceUrl ?? null;
    dto.createdAt = contact.sourceCreatedAt ?? null;
    dto.updatedAt = contact.sourceUpdatedAt ?? null;

    return dto;
  }
}
