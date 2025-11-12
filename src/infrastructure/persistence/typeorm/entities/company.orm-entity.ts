import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'companies' })
export class CompanyOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  sourceId!: string;

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

  @Column({ type: 'enum', enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' })
  status!: 'ACTIVE' | 'ARCHIVED';

  @Column({ type: 'jsonb', nullable: true })
  raw!: Record<string, any> | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sourceUrl!: string | null;
  
  @Column({ type: 'timestamptz', nullable: true })
  sourceCreatedAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  sourceUpdatedAt!: Date | null;

  @Column({ type: 'int', nullable: true })
  sourceCreatedYear!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
