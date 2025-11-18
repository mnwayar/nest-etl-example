import { Column, Entity, OneToMany } from 'typeorm';
import { CrmOrmEntity } from './shared/crm.orm-entity';
import { ContactAssociationOrmEntity } from './contact-association.orm-entity';

@Entity({ name: 'deals' })
export class DealOrmEntity extends CrmOrmEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  name!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stage!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  amount!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  closeDate!: Date | null;

  @OneToMany(
    () => ContactAssociationOrmEntity,
    (association) => association.deal,
  )
  contactAssociations?: ContactAssociationOrmEntity[];
}
