import {
  CrmSyncCheckpoint,
  CrmObjectType,
} from '@core/domain/shared/entities/crm-sync-checkpoint.entity';
import { CrmSyncCheckpointOrmEntity } from '../entities/crm-sync-checkpoint.orm-entity';

export class CrmSyncCheckpointOrmMapper {
  static toDomain(entity: CrmSyncCheckpointOrmEntity): CrmSyncCheckpoint {
    return {
      id: entity.id,
      objectType: entity.objectType as CrmObjectType,
      lastRunAt: entity.lastRunAt,
    };
  }
}
