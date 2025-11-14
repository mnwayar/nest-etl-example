import { CrmEntity, CrmEntityStatus } from '../shared/entities/crm.entity';

export class Deal extends CrmEntity {
  constructor(
    public name: string | null,
    public stage: string | null,
    public closeDate: Date | null,
    public amount: string | null,

    sourceId: string,
    status: CrmEntityStatus,
    sourceUrl: string | null,
    sourceCreatedAt: Date | null,
    sourceUpdatedAt: Date | null,
    raw?: Record<string, any>,
  ) {
    super(sourceId, status, sourceUrl, sourceCreatedAt, sourceUpdatedAt, raw);
  }
}
