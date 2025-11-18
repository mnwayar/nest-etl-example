import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContactOrmEntity } from './contact.orm-entity';
import { CompanyOrmEntity } from './company.orm-entity';
import { DealOrmEntity } from './deal.orm-entity';

export type ContactAssociationTargetType = 'COMPANY' | 'DEAL';

@Entity({ name: 'contact_associations' })
@Index(
  'uq_contact_target_type',
  ['contactSourceId', 'targetSourceId', 'targetType'],
  { unique: true },
)
export class ContactAssociationOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  contactSourceId!: string;

  @Column({ type: 'varchar', length: 255 })
  targetSourceId!: string;

  @Column({
    type: 'enum',
    enum: ['COMPANY', 'DEAL'],
  })
  targetType!: ContactAssociationTargetType;

  @Column({ type: 'int', nullable: true })
  associationTypeId!: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  associationLabel!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  associationCategory!: string | null;

  @ManyToOne(() => ContactOrmEntity, (contact) => contact.contactAssociations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contact_id' })
  contact!: ContactOrmEntity;

  @ManyToOne(() => CompanyOrmEntity, (company) => company.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'company_id' })
  company!: CompanyOrmEntity | null;

  @ManyToOne(() => DealOrmEntity, (deal) => deal.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'deal_id' })
  deal!: DealOrmEntity | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
