import { Column, Entity } from 'typeorm';
import { CrmOrmEntity } from './shared/crm.orm-entity';

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
}
