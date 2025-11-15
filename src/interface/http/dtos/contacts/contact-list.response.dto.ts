import { Contact } from '@core/domain/contacts/contact.entity';

export class ContactListResponseDto {
  id!: string;
  email!: string | null;
  firstname!: string | null;
  lastname!: string | null;
  websiteDomain!: string | null;
  status!: string;
  url!: string | null;
  createdAt!: Date | null;
  updatedAt!: Date | null;

  static fromDomain(contact: Contact): ContactListResponseDto {
    const dto = new ContactListResponseDto();

    dto.id = contact.sourceId;
    dto.email = contact.email;
    dto.firstname = contact.firstname;
    dto.lastname = contact.lastname;
    dto.status = contact.sourceStatus;
    dto.url = contact.sourceUrl ?? null;
    dto.createdAt = contact.sourceCreatedAt ?? null;
    dto.updatedAt = contact.sourceUpdatedAt ?? null;

    return dto;
  }
}
