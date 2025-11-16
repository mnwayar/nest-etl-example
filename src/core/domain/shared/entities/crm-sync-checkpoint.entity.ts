export type CrmObjectType = 'CONTACT' | 'COMPANY' | 'DEAL' | 'ASSOCIATION';

export interface CrmSyncCheckpoint {
  id: number;
  objectType: CrmObjectType;
  lastRunAt: Date;
}
