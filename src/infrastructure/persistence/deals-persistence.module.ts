import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealOrmEntity } from './typeorm/entities/deal.orm-entity';
import { DealTypeOrmRepository } from './repositories/deal.typeorm.repository';
import { DealRepositoryToken } from '@core/domain/deals/deal.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DealOrmEntity])],
  providers: [
    DealTypeOrmRepository,
    {
      provide: DealRepositoryToken,
      useClass: DealTypeOrmRepository,
    },
  ],
  exports: [DealRepositoryToken, DealTypeOrmRepository],
})
export class DealPersistenceModule {}
