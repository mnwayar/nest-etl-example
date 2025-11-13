export class Company {
    constructor(
        public readonly sourceId: string,
        public name: string | null,
        public websiteDomain: string | null,
        public phone: string | null,
        public city: string | null,
        public country: string | null,
        public industry: string | null,
        public status: 'ACTIVE' | 'ARCHIVED',
        public sourceUrl: string | null,
        public sourceCreatedAt: Date | null,
        public sourceUpdatedAt: Date | null,
        public raw?: Record<string, any>,
    ) {}

    isActive():boolean {
        return this.status === 'ACTIVE';
    }

    isArchived(): boolean {
        return this.status === 'ARCHIVED';
    }
}