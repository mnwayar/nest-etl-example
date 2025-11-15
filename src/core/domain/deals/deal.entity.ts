import { CrmEntity, CrmEntityStatus } from '../shared/entities/crm.entity';

export class Deal extends CrmEntity {
  constructor(
    public name: string | null,
    public stage: string | null,
    public closeDate: Date | null,
    public amount: string | null,

    sourceId: string,
    sourceStatus: CrmEntityStatus,
    sourceUrl: string | null,
    sourceCreatedAt: Date | null,
    sourceUpdatedAt: Date | null,
    sourceDeletedAt: Date | null,
    raw?: Record<string, any>,
  ) {
    super(
      sourceId,
      sourceStatus,
      sourceUrl,
      sourceCreatedAt,
      sourceUpdatedAt,
      sourceDeletedAt,
      raw,
    );
  }
}
