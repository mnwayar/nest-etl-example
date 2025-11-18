import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { ListAllCompaniesUseCase } from '@core/application/companies/usecases/list-all-companies.usecase';
import { GetCompanyDetailsUseCase } from '@core/application/companies/usecases/get-company-details.usecase';
import { Company } from '@core/domain/companies/company.entity';
import { CompanyResponseDto } from '../dtos/companies/company.response.dto';
import { NotFoundError } from '@shared/errors';

type ListUseCaseMock = Pick<ListAllCompaniesUseCase, 'execute'>;
type DetailUseCaseMock = Pick<GetCompanyDetailsUseCase, 'execute'>;

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

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let listCompanies: jest.Mocked<ListUseCaseMock>;
  let getCompanyDetails: jest.Mocked<DetailUseCaseMock>;

  beforeEach(async () => {
    listCompanies = {
      execute: jest.fn(),
    };
    getCompanyDetails = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        { provide: ListAllCompaniesUseCase, useValue: listCompanies },
        { provide: GetCompanyDetailsUseCase, useValue: getCompanyDetails },
      ],
    }).compile();

    controller = module.get(CompaniesController);
  });

  describe('findOne', () => {
    it('returns the serialized company details including contacts', async () => {
      const company = buildCompany();
      getCompanyDetails.execute.mockResolvedValue(company);

      const result = await controller.findOne('company-1');

      expect(getCompanyDetails.execute).toHaveBeenCalledWith('company-1');
      expect(result).toEqual(CompanyResponseDto.fromDomain(company));
      expect(result.contacts).toEqual([
        { id: 'contact-1', firstname: 'Ada', lastname: 'Lovelace' },
      ]);
    });

    it('bubbles the NotFoundError from the use case', async () => {
      const error = new NotFoundError('Company not found');
      getCompanyDetails.execute.mockRejectedValue(error);

      await expect(controller.findOne('missing-id')).rejects.toBe(error);
    });
  });
});
