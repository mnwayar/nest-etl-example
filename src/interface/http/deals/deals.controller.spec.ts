import { Test, TestingModule } from '@nestjs/testing';
import { DealsController } from './deals.controller';
import { ListAllDealsUseCase } from '@core/application/deals/usecases/list-all-deals.usecase';
import { GetDealDetailsUseCase } from '@core/application/deals/usecases/get-deal-details.usecase';
import { Deal } from '@core/domain/deals/deal.entity';
import { DealResponseDto } from '../dtos/deals/deal.response.dto';
import { NotFoundError } from '@shared/errors';

type ListUseCaseMock = Pick<ListAllDealsUseCase, 'execute'>;
type DetailUseCaseMock = Pick<GetDealDetailsUseCase, 'execute'>;

const buildDeal = (): Deal =>
  new Deal(
    'Enterprise Renewal',
    'Closed Won',
    new Date('2024-03-01T00:00:00.000Z'),
    '50000',
    'deal-1',
    'ACTIVE',
    'https://app.hubspot.com/deals/deal-1',
    new Date('2024-01-01T00:00:00.000Z'),
    new Date('2024-02-05T00:00:00.000Z'),
    null,
    {},
    [
      {
        id: 'contact-1',
        firstname: 'Ada',
        lastname: 'Lovelace',
      },
    ],
  );

describe('DealsController', () => {
  let controller: DealsController;
  let listDeals: jest.Mocked<ListUseCaseMock>;
  let getDealDetails: jest.Mocked<DetailUseCaseMock>;

  beforeEach(async () => {
    listDeals = {
      execute: jest.fn(),
    };
    getDealDetails = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DealsController],
      providers: [
        { provide: ListAllDealsUseCase, useValue: listDeals },
        { provide: GetDealDetailsUseCase, useValue: getDealDetails },
      ],
    }).compile();

    controller = module.get(DealsController);
  });

  describe('findOne', () => {
    it('returns the serialized deal details including contacts', async () => {
      const deal = buildDeal();
      getDealDetails.execute.mockResolvedValue(deal);

      const result = await controller.findOne('deal-1');

      expect(getDealDetails.execute).toHaveBeenCalledWith('deal-1');
      expect(result).toEqual(DealResponseDto.fromDomain(deal));
      expect(result.contacts).toEqual([
        { id: 'contact-1', firstname: 'Ada', lastname: 'Lovelace' },
      ]);
    });

    it('bubbles the NotFoundError from the use case', async () => {
      const error = new NotFoundError('Deal not found');
      getDealDetails.execute.mockRejectedValue(error);

      await expect(controller.findOne('missing-id')).rejects.toBe(error);
    });
  });
});
