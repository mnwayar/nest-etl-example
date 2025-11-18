import { CrmEntity, CrmEntityStatus } from '../shared/entities/crm.entity';

export type ContactCompanySummary = {
  id: string;
  name: string | null;
};

export type ContactDealSummary = {
  id: string;
  name: string | null;
};

export class Contact extends CrmEntity {
  constructor(
    public email: string | null,
    public firstname: string | null,
    public lastname: string | null,
    public phone: string | null,

    sourceId: string,
    sourceStatus: CrmEntityStatus,
    sourceUrl: string | null,
    sourceCreatedAt: Date | null,
    sourceUpdatedAt: Date | null,
    sourceArchivedAt: Date | null,
    raw?: Record<string, any>,
    public readonly companies: ContactCompanySummary[] = [],
    public readonly deals: ContactDealSummary[] = [],
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
