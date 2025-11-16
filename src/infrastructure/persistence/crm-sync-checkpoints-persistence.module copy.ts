import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmSyncCheckpointOrmEntity } from './typeorm/entities/crm-sync-checkpoint.orm-entity';
import { CrmSyncCheckpointTypeOrmRepository } from './repositories/crm-sync-checkpoint.typeorm.repository';
import { CrmSyncCheckpointRepositoryToken } from '../../core/domain/shared/repositories/crm-sync-checkpoint.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CrmSyncCheckpointOrmEntity])],
  providers: [
    CrmSyncCheckpointTypeOrmRepository,
    {
      provide: CrmSyncCheckpointRepositoryToken,
      useClass: CrmSyncCheckpointTypeOrmRepository,
    },
  ],
  exports: [
    CrmSyncCheckpointRepositoryToken,
    CrmSyncCheckpointTypeOrmRepository,
  ],
})
export class CrmSyncCheckpointsPersistenceModule {}
