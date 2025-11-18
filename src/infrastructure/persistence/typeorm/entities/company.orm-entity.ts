import { Column, Entity, OneToMany } from 'typeorm';
import { CrmOrmEntity } from './shared/crm.orm-entity';
import { ContactAssociationOrmEntity } from './contact-association.orm-entity';

@Entity({ name: 'companies' })
export class CompanyOrmEntity extends CrmOrmEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  name!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  websiteDomain!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  country!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  industry!: string | null;

  @OneToMany(
    () => ContactAssociationOrmEntity,
    (association) => association.company,
  )
  contactAssociations?: ContactAssociationOrmEntity[];
}
