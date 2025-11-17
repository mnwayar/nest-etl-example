import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactRepository } from '@core/domain/contacts/contact.repository';
import { Contact } from '@core/domain/contacts/contact.entity';
import { ContactOrmEntity } from '../typeorm/entities/contact.orm-entity';
import { ContactOrmMapper } from '../typeorm/mappers/contact-orm.mapper';

@Injectable()
export class ContactTypeOrmRepository implements ContactRepository {
  constructor(
    @InjectRepository(ContactOrmEntity)
    private readonly repository: Repository<ContactOrmEntity>,
  ) {}

  async syncFromSource(contacts: Contact[]): Promise<void> {
    if (!contacts.length) {
      return;
    }

    const entities = contacts.map((contact) => {
      return ContactOrmMapper.toOrm(contact);
    });

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(ContactOrmEntity)
      .values(entities)
      .orUpdate(
        [
          'email',
          'firstname',
          'lastname',
          'phone',
          'source_status',
          'source_url',
          'source_created_at',
          'source_updated_at',
          'source_archived_at',
          'source_created_year',
          'raw',
          'updated_at',
        ],
        ['source_id'],
      )
      .execute();
  }

  async getAll(): Promise<Contact[]> {
    const contacts = await this.repository.find({
      order: { id: 'ASC' },
    });

    return contacts.map((contact) => {
      return ContactOrmMapper.toDomain(contact);
    });
  }

  async getById(id: string): Promise<Contact | null> {
    const contact = await this.repository.findOneBy({
      sourceId: id,
    });

    if (!contact) return null;

    return ContactOrmMapper.toDomain(contact);
  }
}
