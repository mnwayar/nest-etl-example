import { ContactAssociation } from '../entities/contact-association.entity';

export const ContactAssociationRepositoryToken = Symbol(
  'ContactAssociationRepository',
);

export interface ContactAssociationRepository {
  upsertManyFromSource(associations: ContactAssociation[]): Promise<void>;
}
