import { Deal } from '@core/domain/deals/deal.entity';

export class DealListResponseDto {
  id!: string;
  name!: string | null;
  stage!: string | null;
  status!: string;
  url!: string | null;
  createdAt!: Date | null;
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
