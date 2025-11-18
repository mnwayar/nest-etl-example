import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ListAllContactsUseCase } from '@core/application/contacts/usecases/list-all-contacts.usecase';
import { GetContactDetailsUseCase } from '@core/application/contacts/usecases/get-contact-details.usecase';
import { Contact } from '@core/domain/contacts/contact.entity';
import { ContactResponseDto } from '../dtos/contacts/contact.response.dto';
import { NotFoundError } from '@shared/errors';

type ListUseCaseMock = Pick<ListAllContactsUseCase, 'execute'>;
type DetailUseCaseMock = Pick<GetContactDetailsUseCase, 'execute'>;

const buildContact = (): Contact =>
  new Contact(
    'ada@example.com',
    'Ada',
    'Lovelace',
    '+1-111-1111',
    'contact-1',
    'ACTIVE',
    'https://app.hubspot.com/contacts/contact-1',
    new Date('2024-01-01T00:00:00.000Z'),
    new Date('2024-01-05T00:00:00.000Z'),
    null,
    {},
    [
      {
        id: 'company-1',
        name: 'Acme Inc.',
      },
    ],
    [
      {
        id: 'deal-1',
        name: 'Enterprise Renewal',
      },
    ],
  );

describe('ContactsController', () => {
  let controller: ContactsController;
  let listContacts: jest.Mocked<ListUseCaseMock>;
  let getContactDetails: jest.Mocked<DetailUseCaseMock>;

  beforeEach(async () => {
    listContacts = {
      execute: jest.fn(),
    };
    getContactDetails = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        { provide: ListAllContactsUseCase, useValue: listContacts },
        { provide: GetContactDetailsUseCase, useValue: getContactDetails },
      ],
    }).compile();

    controller = module.get(ContactsController);
  });

  describe('findOne', () => {
    it('returns the serialized contact details including companies and deals', async () => {
      const contact = buildContact();
      getContactDetails.execute.mockResolvedValue(contact);

      const result = await controller.findOne('contact-1');

      expect(getContactDetails.execute).toHaveBeenCalledWith('contact-1');
      expect(result).toEqual(ContactResponseDto.fromDomain(contact));
      expect(result.companies).toEqual([
        { id: 'company-1', name: 'Acme Inc.' },
      ]);
      expect(result.deals).toEqual([
        { id: 'deal-1', name: 'Enterprise Renewal' },
      ]);
    });

    it('bubbles the NotFoundError from the use case', async () => {
      const error = new NotFoundError('Contact not found');
      getContactDetails.execute.mockRejectedValue(error);

      await expect(controller.findOne('missing-id')).rejects.toBe(error);
    });
  });
});
