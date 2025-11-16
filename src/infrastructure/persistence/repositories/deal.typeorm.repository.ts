import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealRepository } from '@core/domain/deals/deal.repository';
import { Deal } from '@core/domain/deals/deal.entity';
import { DealOrmEntity } from '../typeorm/entities/deal.orm-entity';
import { DealOrmMapper } from '../typeorm/mappers/deal-orm.mapper';

@Injectable()
export class DealTypeOrmRepository implements DealRepository {
  constructor(
    @InjectRepository(DealOrmEntity)
    private readonly repository: Repository<DealOrmEntity>,
  ) {}

  async syncFromSource(deals: Deal[]): Promise<void> {
    if (!deals.length) {
      return;
    }

    const entities = deals.map((deal) => {
      return DealOrmMapper.toOrm(deal);
    });

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(DealOrmEntity)
      .values(entities)
      .orUpdate(
        [
          'name',
          'stage',
          'amount',
          'close_date',
          'status',
          'source_url',
          'source_created_at',
          'source_updated_at',
          'source_created_year',
          'raw',
          'updated_at',
        ],
        ['source_id'],
      )
      .execute();
  }

  async getAll(): Promise<Deal[]> {
    const deals = await this.repository.find({
      order: { id: 'ASC' },
    });

    return deals.map((deal) => {
      return DealOrmMapper.toDomain(deal);
    });
  }

  async getById(id: string): Promise<Deal | null> {
    const deal = await this.repository.findOneBy({
      sourceId: id,
    });

    if (!deal) return null;

    return DealOrmMapper.toDomain(deal);
  }
}
