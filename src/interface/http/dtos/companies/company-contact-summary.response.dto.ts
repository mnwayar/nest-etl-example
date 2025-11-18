import { ApiProperty } from '@nestjs/swagger';
import { CompanyContactSummary } from '@core/domain/companies/company.entity';

export class CompanyContactSummaryDto {
  @ApiProperty({ description: 'HubSpot source identifier for the contact' })
  id!: string;

  @ApiProperty({ description: 'Contact first name', nullable: true })
  firstname!: string | null;

  @ApiProperty({ description: 'Contact last name', nullable: true })
  lastname!: string | null;

  static fromDomain(contact: CompanyContactSummary): CompanyContactSummaryDto {
    const dto = new CompanyContactSummaryDto();

    dto.id = contact.id;
    dto.firstname = contact.firstname;
    dto.lastname = contact.lastname;

    return dto;
  }
}
