import { HubspotContactAssociationRaw } from '../types/hubspot-contact-association.type';
import {
  ContactAssociation,
  ContactAssociationTargetType,
} from '../../../domain/associations/entities/contact-association.entity';

export class HubspotContactAssociationMapper {
  static toDomain(
    results: HubspotContactAssociationRaw[],
    targetType: ContactAssociationTargetType,
  ): ContactAssociation[] {
    const entities: ContactAssociation[] = [];

    for (const result of results) {
      const contactSourceId = result.from.id;

      for (const to of result.to ?? []) {
        const firstType = to.associationTypes?.[0];

        entities.push(
          new ContactAssociation(
            null,
            contactSourceId,
            String(to.toObjectId),
            targetType,
            firstType?.typeId ?? null,
            firstType?.label ?? null,
            firstType?.category ?? null,
          ),
        );
      }
    }

    return entities;
  }
}
