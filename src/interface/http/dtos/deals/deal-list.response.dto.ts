import { ApiProperty } from '@nestjs/swagger';
import { Deal } from '@core/domain/deals/deal.entity';

export class DealListResponseDto {
  @ApiProperty({ description: 'HubSpot source identifier' })
  id!: string;

  @ApiProperty({ description: 'Deal name in HubSpot', nullable: true })
  name!: string | null;

  @ApiProperty({ description: 'Pipeline stage name', nullable: true })
  stage!: string | null;

  @ApiProperty({
    description: 'Lifecycle or sync status received from HubSpot',
  })
  status!: string;

  @ApiProperty({
    description: 'Direct HubSpot URL to the deal record',
    nullable: true,
  })
  url!: string | null;

  @ApiProperty({
    description: 'Timestamp when the deal was created in HubSpot',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  createdAt!: Date | null;

  @ApiProperty({
    description: 'Timestamp when the deal was last updated in HubSpot',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  updatedAt!: Date | null;

  static fromDomain(deal: Deal): DealListResponseDto {
    const dto = new DealListResponseDto();

    dto.id = deal.sourceId;
    dto.name = deal.name;
    dto.status = deal.sourceStatus;
    dto.stage = deal.stage ?? null;
    dto.url = deal.sourceUrl ?? null;
    dto.createdAt = deal.sourceCreatedAt ?? null;
    dto.updatedAt = deal.sourceUpdatedAt ?? null;

    return dto;
  }
}
