import { Module } from '@nestjs/common';
import { DealsPersistenceModule } from '@infra/persistence/deals-persistence.module';
import { DealsController } from './deals.controller';
import { ListAllDealsUseCase } from '@core/application/deals/usecases/list-all-deals.usecase';
import { GetDealDetailsUseCase } from '@core/application/deals/usecases/get-deal-details.usecase';

@Module({
  imports: [DealsPersistenceModule],
  controllers: [DealsController],
  providers: [ListAllDealsUseCase, GetDealDetailsUseCase],
})
export class DealsHttpModule {}
