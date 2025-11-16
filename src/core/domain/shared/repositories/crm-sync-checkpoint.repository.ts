import {
  CrmObjectType,
  CrmSyncCheckpoint,
} from '../entities/crm-sync-checkpoint.entity';

export const CrmSyncCheckpointRepositoryToken = Symbol(
  'CrmSyncCheckpointRepository',
);

export interface CrmSyncCheckpointRepository {
  getLastSyncByObjectType(
    objectType: CrmObjectType,
  ): Promise<CrmSyncCheckpoint | null>;

  createNewSync(
    objectType: CrmObjectType,
    lastRunAt: Date,
  ): Promise<CrmSyncCheckpoint>;
}
