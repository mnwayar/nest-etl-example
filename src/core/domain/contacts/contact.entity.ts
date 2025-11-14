import { CrmEntity, CrmEntityStatus } from '../shared/entities/crm.entity';

export class Contact extends CrmEntity {
  constructor(
    public email: string | null,
    public firstname: string | null,
    public lastname: string | null,
    public phone: string | null,

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
