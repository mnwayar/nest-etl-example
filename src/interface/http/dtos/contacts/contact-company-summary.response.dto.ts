import { ApiProperty } from '@nestjs/swagger';
import { ContactCompanySummary } from '@core/domain/contacts/contact.entity';

export class ContactCompanySummaryDto {
  @ApiProperty({ description: 'HubSpot source identifier for the company' })
  id!: string;

  @ApiProperty({ description: 'Company name', nullable: true })
  name!: string | null;

  static fromDomain(company: ContactCompanySummary): ContactCompanySummaryDto {
    const dto = new ContactCompanySummaryDto();

    dto.id = company.id;
    dto.name = company.name ?? null;

    return dto;
  }
}
