export type CrmEntityStatus = 'ACTIVE' | 'ARCHIVED';

export abstract class CrmEntity {
  constructor(
    public readonly sourceId: string,
    public status: CrmEntityStatus,
    public sourceUrl: string | null,
    public sourceCreatedAt: Date | null,
    public sourceUpdatedAt: Date | null,
    public raw?: Record<string, any>,
  ) {}

  isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  isArchived(): boolean {
    return this.status === 'ARCHIVED';
  }
}
