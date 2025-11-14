import { Inject, Injectable } from '@nestjs/common';
import {
  DealRepository,
  DealRepositoryToken,
} from '@core/domain/deals/deal.repository';
import { Deal } from '@core/domain/deals/deal.entity';
import { ListAllEntitiesUsecase } from '../../shared/usecases/list-all-entities.usecase';

@Injectable()
export class ListAllDealsUsecase extends ListAllEntitiesUsecase<Deal> {
  constructor(
    @Inject(DealRepositoryToken)
    dealRepository: DealRepository,
  ) {
    super(dealRepository);
  }
}
