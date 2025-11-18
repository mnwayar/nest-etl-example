import { CrmEntity, CrmEntityStatus } from '../shared/entities/crm.entity';

export type DealContactSummary = {
  id: string;
  firstname: string | null;
  lastname: string | null;
};

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
    sourceArchivedAt: Date | null,
    raw?: Record<string, any>,
    public readonly contacts: DealContactSummary[] = [],
  ) {
    super(
      sourceId,
      sourceStatus,
      sourceUrl,
      sourceCreatedAt,
      sourceUpdatedAt,
      sourceArchivedAt,
      raw,
    );
  }
}
