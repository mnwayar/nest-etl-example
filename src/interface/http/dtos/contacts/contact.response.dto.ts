import { ApiProperty } from '@nestjs/swagger';
import { Contact } from '@core/domain/contacts/contact.entity';

export class ContactResponseDto {
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

  @ApiProperty({ description: 'Contact phone number', nullable: true })
  phone!: string | null;

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

  static fromDomain(contact: Contact): ContactResponseDto {
    const dto = new ContactResponseDto();

    dto.id = contact.sourceId;
    dto.email = contact.email ?? null;
    dto.firstname = contact.firstname ?? null;
    dto.lastname = contact.lastname ?? null;
    dto.phone = contact.phone ?? null;
    dto.status = contact.sourceStatus;
    dto.phone = contact.phone ?? null;
    dto.url = contact.sourceUrl ?? null;
    dto.createdAt = contact.sourceCreatedAt ?? null;
    dto.updatedAt = contact.sourceUpdatedAt ?? null;

    return dto;
  }
}
