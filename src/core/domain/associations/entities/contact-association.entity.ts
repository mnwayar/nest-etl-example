export type ContactAssociationTargetType = 'COMPANY' | 'DEAL';

export class ContactAssociation {
  constructor(
    public readonly id: number | null,
    public readonly contactSourceId: string,
    public readonly targetSourceId: string,
    public readonly targetType: ContactAssociationTargetType,
    public readonly associationTypeId: number | null,
    public readonly associationLabel: string | null,
    public readonly associationCategory: string | null,
  ) {}
}
