import { GetContactDetailsUseCase } from './get-contact-details.usecase';
import { Contact } from '@core/domain/contacts/contact.entity';
import { ContactRepository } from '@core/domain/contacts/contact.repository';
import { NotFoundError } from '@shared/errors';

const createRepositoryMock = (): jest.Mocked<ContactRepository> => ({
  syncFromSource: jest.fn<Promise<void>, [Contact[]]>(),
  getAll: jest.fn<Promise<Contact[]>, []>(),
  getById: jest.fn<Promise<Contact | null>, [string]>(),
  listSourceIdsUpdatedSince: jest.fn<
    Promise<string[]>,
    [Date | null | undefined]
  >(),
});

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

describe('GetContactDetailsUseCase', () => {
  let repository: jest.Mocked<ContactRepository>;
  let useCase: GetContactDetailsUseCase;

  beforeEach(() => {
    repository = createRepositoryMock();
    useCase = new GetContactDetailsUseCase(repository);
  });

  it('returns a contact with companies and deals when the id exists', async () => {
    const contact = buildContact();
    repository.getById.mockResolvedValue(contact);

    const result = await useCase.execute('contact-1');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repository.getById).toHaveBeenCalledWith('contact-1');
    expect(result).toBe(contact);
    expect(result.companies).toEqual([{ id: 'company-1', name: 'Acme Inc.' }]);
    expect(result.deals).toEqual([
      { id: 'deal-1', name: 'Enterprise Renewal' },
    ]);
  });

  it('throws NotFoundError when the contact does not exist', async () => {
    repository.getById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
