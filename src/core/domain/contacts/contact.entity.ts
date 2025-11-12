export class Contact {
    constructor(
        public readonly externalId: string,
        public firstname: string | null,
        public lastname: string | null,
        public email: string | null,
        public status: 'ACTIVE' | 'ARCHIVED',
        public raw?: Record<string, any>,
    ) {}

    isActive():boolean {
        return this.status === 'ACTIVE';
    }

    isArchived(): boolean {
        return this.status === 'ARCHIVED';
    }
}