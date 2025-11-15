import { CrmEntity, CrmEntityStatus } from '../shared/entities/crm.entity';

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
