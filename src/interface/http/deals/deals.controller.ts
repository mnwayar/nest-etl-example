import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ListAllDealsUseCase } from '@core/application/deals/usecases/list-all-deals.usecase';
import { GetDealDetailsUseCase } from '@core/application/deals/usecases/get-deal-details.usecase';
import { DealListResponseDto } from '../dtos/deals/deal-list.response.dto';
import { DealResponseDto } from '../dtos/deals/deal.response.dto';

@Controller('deals')
export class DealsController {
  constructor(
    private readonly listDeals: ListAllDealsUseCase,
    private readonly getDealDetails: GetDealDetailsUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    const deals = await this.listDeals.execute();
    return deals.map((c) => DealListResponseDto.fromDomain(c));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const deal = await this.getDealDetails.execute(id);

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    return DealResponseDto.fromDomain(deal);
  }
}
