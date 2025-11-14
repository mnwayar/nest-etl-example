export class Contact {
  constructor(
    public readonly sourceId: string,
    public email: string | null,
    public firstname: string | null,
    public lastname: string | null,
    public phone: string | null,
    public status: 'ACTIVE' | 'ARCHIVED',
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
