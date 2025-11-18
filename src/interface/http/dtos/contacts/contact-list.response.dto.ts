import { ApiProperty } from '@nestjs/swagger';
import { Contact } from '@core/domain/contacts/contact.entity';

export class ContactListResponseDto {
  @ApiProperty({ description: 'HubSpot source identifier' })
  id!: string;

  @ApiProperty({
    description: 'Primary email address stored in HubSpot',
    nullable: true,
  })
  email!: string | null;

  @ApiProperty({ description: 'Contact first name', nullable: true })
  firstname!: string | null;

  @ApiProperty({ description: 'Contact last name', nullable: true })
  lastname!: string | null;

  @ApiProperty({
    description: 'Associated company website domain, when available',
    nullable: true,
  })
  websiteDomain!: string | null;

  @ApiProperty({
    description: 'Lifecycle or sync status received from HubSpot',
  })
  status!: string;

  @ApiProperty({
    description: 'Direct HubSpot URL to the contact record',
    nullable: true,
  })
  url!: string | null;

  @ApiProperty({
    description: 'Timestamp when the contact was created in HubSpot',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  createdAt!: Date | null;

  @ApiProperty({
    description: 'Timestamp when the contact was last updated in HubSpot',
    type: String,
    format: 'date-time',
    nullable: true,
  })
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
