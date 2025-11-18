import { ApiProperty } from '@nestjs/swagger';
import { Company } from '@core/domain/companies/company.entity';

export class CompanyResponseDto {
  @ApiProperty({ description: 'HubSpot source identifier' })
  id!: string;

  @ApiProperty({ description: 'Company display name', nullable: true })
  name!: string | null;

  @ApiProperty({
    description: 'Primary website domain synced from HubSpot',
    nullable: true,
  })
  websiteDomain!: string | null;

  @ApiProperty({
    description: 'Lifecycle or sync status received from HubSpot',
  })
  status!: string;

  @ApiProperty({ description: 'Main phone number', nullable: true })
  phone!: string | null;

  @ApiProperty({ description: 'City for the company address', nullable: true })
  city!: string | null;

  @ApiProperty({
    description: 'Country for the company address',
    nullable: true,
  })
  country!: string | null;

  @ApiProperty({ description: 'Identified industry segment', nullable: true })
  industry!: string | null;

  @ApiProperty({
    description: 'Direct HubSpot URL to the company record',
    nullable: true,
  })
  url!: string | null;

  @ApiProperty({
    description: 'Timestamp when the company was created in HubSpot',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  createdAt!: Date | null;

  @ApiProperty({
    description: 'Timestamp when the company was last updated in HubSpot',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  updatedAt!: Date | null;

  static fromDomain(company: Company): CompanyResponseDto {
    const dto = new CompanyResponseDto();

    dto.id = company.sourceId;
    dto.name = company.name;
    dto.websiteDomain = company.websiteDomain ?? null;
    dto.status = company.sourceStatus;
    dto.phone = company.phone ?? null;
    dto.city = company.city ?? null;
    dto.country = company.country ?? null;
    dto.industry = company.industry ?? null;
    dto.url = company.sourceUrl ?? null;
    dto.createdAt = company.sourceCreatedAt ?? null;
    dto.updatedAt = company.sourceUpdatedAt ?? null;

    return dto;
  }
}
