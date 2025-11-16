import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrmSyncCheckpointRepository } from '@core/domain/shared/repositories/crm-sync-checkpoint.repository';
import {
  CrmObjectType,
  CrmSyncCheckpoint,
} from '@core/domain/shared/entities/crm-sync-checkpoint.entity';
import {
  CrmSyncCheckpointOrmEntity,
  CrmObjectTypeOrm,
} from '../typeorm/entities/crm-sync-checkpoint.orm-entity';
import { CrmSyncCheckpointOrmMapper } from '../typeorm/mappers/crm-sync-checkpoint-orm.mapper';

@Injectable()
export class CrmSyncCheckpointTypeOrmRepository
  implements CrmSyncCheckpointRepository
{
  constructor(
    @InjectRepository(CrmSyncCheckpointOrmEntity)
    private readonly crmSyncCheckpointRepository: Repository<CrmSyncCheckpointOrmEntity>,
  ) {}

  private async getByObjectType(
    objectType: CrmObjectType,
  ): Promise<CrmSyncCheckpointOrmEntity | null> {
    return await this.crmSyncCheckpointRepository.findOneBy({
      objectType: objectType as CrmObjectTypeOrm,
    });
  }

  async getLastSyncByObjectType(
    objectType: CrmObjectType,
  ): Promise<CrmSyncCheckpoint | null> {
    const entity = await this.getByObjectType(objectType);

    if (!entity) return null;

    return CrmSyncCheckpointOrmMapper.toDomain(entity);
  }

  async createNewSync(
    objectType: CrmObjectType,
    lastRunAt: Date,
  ): Promise<CrmSyncCheckpoint> {
    let entity = await this.getByObjectType(objectType);

    if (!entity) {
      entity = this.crmSyncCheckpointRepository.create({
        objectType: objectType as CrmObjectTypeOrm,
        lastRunAt,
      });
    } else {
      entity.lastRunAt = lastRunAt;
    }

    const saved = await this.crmSyncCheckpointRepository.save(entity);
    return CrmSyncCheckpointOrmMapper.toDomain(saved);
  }
}
