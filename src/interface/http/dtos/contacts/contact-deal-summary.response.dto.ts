import { ApiProperty } from '@nestjs/swagger';
import { ContactDealSummary } from '@core/domain/contacts/contact.entity';

export class ContactDealSummaryDto {
  @ApiProperty({ description: 'HubSpot source identifier for the deal' })
  id!: string;

  @ApiProperty({ description: 'Deal name', nullable: true })
  name!: string | null;

  static fromDomain(deal: ContactDealSummary): ContactDealSummaryDto {
    const dto = new ContactDealSummaryDto();

    dto.id = deal.id;
    dto.name = deal.name ?? null;

    return dto;
  }
}
