import { CrmEntity, CrmEntityStatus } from '../shared/entities/crm.entity';

export type CompanyContactSummary = {
  id: string;
  firstname: string | null;
  lastname: string | null;
};

export class Company extends CrmEntity {
  constructor(
    public name: string | null,
    public websiteDomain: string | null,
    public phone: string | null,
    public city: string | null,
    public country: string | null,
    public industry: string | null,

    sourceId: string,
    sourceStatus: CrmEntityStatus,
    sourceUrl: string | null,
    sourceCreatedAt: Date | null,
    sourceUpdatedAt: Date | null,
    sourceArchivedAt: Date | null,
    raw?: Record<string, any>,
    public contacts: CompanyContactSummary[] = [],
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
