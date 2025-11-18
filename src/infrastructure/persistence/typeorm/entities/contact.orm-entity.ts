import { Column, Entity, OneToMany } from 'typeorm';
import { CrmOrmEntity } from './shared/crm.orm-entity';
import { ContactAssociationOrmEntity } from './contact-association.orm-entity';

@Entity({ name: 'contacts' })
export class ContactOrmEntity extends CrmOrmEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  firstname!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastname!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone!: string | null;

  @OneToMany(
    () => ContactAssociationOrmEntity,
    (association) => association.contact,
  )
  contactAssociations?: ContactAssociationOrmEntity[];
}
