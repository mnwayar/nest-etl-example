import { Inject, Injectable } from '@nestjs/common';
import {
  DealRepository,
  DealRepositoryToken,
} from '@core/domain/deals/deal.repository';
import { Deal } from '@core/domain/deals/deal.entity';
import { GetEntityDetailsUsecase } from '../../shared/usecases/get-entity-details.usecase';

@Injectable()
export class GetDealDetailsUseCase extends GetEntityDetailsUsecase<Deal> {
  constructor(
    @Inject(DealRepositoryToken)
    dealRepository: DealRepository,
  ) {
    super(dealRepository);
  }
}
