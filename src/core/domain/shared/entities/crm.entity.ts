export type CrmEntityStatus = 'ACTIVE' | 'ARCHIVED';

export abstract class CrmEntity {
  constructor(
    public readonly sourceId: string,
    public sourceStatus: CrmEntityStatus,
    public sourceUrl: string | null,
    public sourceCreatedAt: Date | null,
    public sourceUpdatedAt: Date | null,
    public sourceDeletedAt: Date | null,
    public raw?: Record<string, any>,
  ) {}

  isActive(): boolean {
    return this.sourceStatus === 'ACTIVE';
  }

  isArchived(): boolean {
    return this.sourceStatus === 'ARCHIVED';
  }
}
