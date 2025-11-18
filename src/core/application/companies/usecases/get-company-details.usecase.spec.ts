import { GetCompanyDetailsUseCase } from './get-company-details.usecase';
import { Company } from '@core/domain/companies/company.entity';
import { CompanyRepository } from '@core/domain/companies/company.repository';
import { NotFoundError } from '@shared/errors';

const createRepositoryMock = (): jest.Mocked<CompanyRepository> => ({
  syncFromSource: jest.fn<Promise<void>, [Company[]]>(),
  getAll: jest.fn<Promise<Company[]>, []>(),
  getById: jest.fn<Promise<Company | null>, [string]>(),
});

const buildCompany = (): Company =>
  new Company(
    'Acme Inc.',
    'acme.com',
    '+1-111-1111',
    'New York',
    'USA',
    'Software',
    'company-1',
    'ACTIVE',
    'https://app.hubspot.com/companies/company-1',
    new Date('2024-01-01T00:00:00.000Z'),
    new Date('2024-01-05T00:00:00.000Z'),
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

describe('GetCompanyDetailsUseCase', () => {
  let repository: jest.Mocked<CompanyRepository>;
  let useCase: GetCompanyDetailsUseCase;

  beforeEach(() => {
    repository = createRepositoryMock();
    useCase = new GetCompanyDetailsUseCase(repository);
  });

  it('returns a company with its associated contacts when the id exists', async () => {
    const company = buildCompany();
    repository.getById.mockResolvedValue(company);

    const result = await useCase.execute('company-1');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repository.getById).toHaveBeenCalledWith('company-1');
    expect(result).toBe(company);
    expect(result.name).toBe('Acme Inc.');
    expect(result.contacts).toEqual([
      { id: 'contact-1', firstname: 'Ada', lastname: 'Lovelace' },
    ]);
  });

  it('throws NotFoundError when the company does not exist', async () => {
    repository.getById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
