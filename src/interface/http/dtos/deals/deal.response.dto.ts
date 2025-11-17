import { Deal } from '@core/domain/deals/deal.entity';

export class DealResponseDto {
  id!: string;
  name!: string | null;
  stage!: string | null;
  amount!: string | null;
  closeDate!: Date | null;
  status!: string;
  url!: string | null;
  createdAt!: Date | null;
  updatedAt!: Date | null;

  static fromDomain(deal: Deal): DealResponseDto {
    const dto = new DealResponseDto();

    dto.id = deal.sourceId;
    dto.name = deal.name;
    dto.status = deal.sourceStatus;
    dto.stage = deal.stage ?? null;
    dto.amount = deal.amount ?? null;
    dto.closeDate = deal.closeDate ?? null;
    dto.url = deal.sourceUrl ?? null;
    dto.createdAt = deal.sourceCreatedAt ?? null;
    dto.updatedAt = deal.sourceUpdatedAt ?? null;

    return dto;
  }
}
