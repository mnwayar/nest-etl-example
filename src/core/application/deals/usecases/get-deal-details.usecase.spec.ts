import { GetDealDetailsUseCase } from './get-deal-details.usecase';
import { Deal } from '@core/domain/deals/deal.entity';
import { DealRepository } from '@core/domain/deals/deal.repository';
import { NotFoundError } from '@shared/errors';

const createRepositoryMock = (): jest.Mocked<DealRepository> => ({
  syncFromSource: jest.fn<Promise<void>, [Deal[]]>(),
  getAll: jest.fn<Promise<Deal[]>, []>(),
  getById: jest.fn<Promise<Deal | null>, [string]>(),
});

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

describe('GetDealDetailsUseCase', () => {
  let repository: jest.Mocked<DealRepository>;
  let useCase: GetDealDetailsUseCase;

  beforeEach(() => {
    repository = createRepositoryMock();
    useCase = new GetDealDetailsUseCase(repository);
  });

  it('returns a deal with its associated contacts when the id exists', async () => {
    const deal = buildDeal();
    repository.getById.mockResolvedValue(deal);

    const result = await useCase.execute('deal-1');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repository.getById).toHaveBeenCalledWith('deal-1');
    expect(result).toBe(deal);
    expect(result.contacts).toEqual([
      { id: 'contact-1', firstname: 'Ada', lastname: 'Lovelace' },
    ]);
    expect(result.name).toBe('Enterprise Renewal');
  });

  it('throws NotFoundError when the deal does not exist', async () => {
    repository.getById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
