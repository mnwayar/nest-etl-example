import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CrmObjectTypeOrm {
  CONTACT = 'CONTACT',
  COMPANY = 'COMPANY',
  DEAL = 'DEAL',
  ASSOCIATION = 'ASSOCIATION',
}

@Entity('crm_sync_checkpoints')
export class CrmSyncCheckpointOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: CrmObjectTypeOrm })
  objectType!: CrmObjectTypeOrm;

  @Column({ type: 'timestamptz' })
  lastRunAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
