import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class CrmOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  sourceId!: string;

  @Column({ type: 'enum', enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' })
  sourceStatus!: 'ACTIVE' | 'ARCHIVED';

  @Column({ type: 'varchar', length: 255, nullable: true })
  sourceUrl!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  sourceCreatedAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  sourceUpdatedAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  sourceDeletedAt!: Date | null;

  @Column({ type: 'int', nullable: true })
  sourceCreatedYear!: number | null;

  @Column({ type: 'jsonb', nullable: true })
  raw!: Record<string, any> | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
