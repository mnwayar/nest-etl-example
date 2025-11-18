import { ApiProperty } from '@nestjs/swagger';
import { DealContactSummary } from '@core/domain/deals/deal.entity';

export class DealContactSummaryDto {
  @ApiProperty({ description: 'HubSpot source identifier for the contact' })
  id!: string;

  @ApiProperty({ description: 'Contact first name', nullable: true })
  firstname!: string | null;

  @ApiProperty({ description: 'Contact last name', nullable: true })
  lastname!: string | null;

  static fromDomain(contact: DealContactSummary): DealContactSummaryDto {
    const dto = new DealContactSummaryDto();

    dto.id = contact.id;
    dto.firstname = contact.firstname;
    dto.lastname = contact.lastname;

    return dto;
  }
}
