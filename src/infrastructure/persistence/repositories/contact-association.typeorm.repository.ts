import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactAssociationRepository } from '@core/domain/associations/repositories/contact-association.repository';
import { ContactAssociation } from '@core/domain/associations/entities/contact-association.entity';
import { InfrastructureError } from '@shared/errors';
import { ContactAssociationOrmEntity } from '../typeorm/entities/contact-association.orm-entity';
import { ContactOrmEntity } from '../typeorm/entities/contact.orm-entity';
import { CompanyOrmEntity } from '../typeorm/entities/company.orm-entity';
import { DealOrmEntity } from '../typeorm/entities/deal.orm-entity';

@Injectable()
export class ContactAssociationTypeOrmRepository
  implements ContactAssociationRepository
{
  constructor(
    @InjectRepository(ContactAssociationOrmEntity)
    private readonly repository: Repository<ContactAssociationOrmEntity>,

    @InjectRepository(ContactOrmEntity)
    private readonly contactRepository: Repository<ContactOrmEntity>,

    @InjectRepository(CompanyOrmEntity)
    private readonly companyRepository: Repository<CompanyOrmEntity>,

    @InjectRepository(DealOrmEntity)
    private readonly dealRepository: Repository<DealOrmEntity>,
  ) {}

  async upsertManyFromSource(
    associations: ContactAssociation[],
  ): Promise<void> {
    if (!associations.length) return;

    try {
      for (const association of associations) {
        const contact = await this.contactRepository.findOne({
          where: { sourceId: association.contactSourceId },
        });
        if (!contact) {
          continue;
        }

        let company: CompanyOrmEntity | null = null;
        let deal: DealOrmEntity | null = null;

        if (association.targetType === 'COMPANY') {
          company = await this.companyRepository.findOne({
            where: { sourceId: association.targetSourceId },
          });
        } else {
          deal = await this.dealRepository.findOne({
            where: { sourceId: association.targetSourceId },
          });
        }

        const existing = await this.repository.findOne({
          where: {
            contactSourceId: association.contactSourceId,
            targetSourceId: association.targetSourceId,
            targetType: association.targetType,
          },
          relations: ['contact', 'company', 'deal'],
        });

        if (!existing) {
          const entity = this.repository.create({
            contactSourceId: association.contactSourceId,
            targetSourceId: association.targetSourceId,
            targetType: association.targetType,
            associationTypeId: association.associationTypeId,
            associationLabel: association.associationLabel,
            associationCategory: association.associationCategory,
            contact,
            company: association.targetType === 'COMPANY' ? company : null,
            deal: association.targetType === 'DEAL' ? deal : null,
          });

          await this.repository.save(entity);
        } else {
          existing.associationTypeId = association.associationTypeId;
          existing.associationLabel = association.associationLabel;
          existing.associationCategory = association.associationCategory;
          existing.contact = contact;
          existing.company =
            association.targetType === 'COMPANY' ? company : null;
          existing.deal = association.targetType === 'DEAL' ? deal : null;

          await this.repository.save(existing);
        }
      }
    } catch (error) {
      throw new InfrastructureError(
        'Failed to upsert contact associations',
        error,
      );
    }
  }

  async findForContact(
    contactId: number,
  ): Promise<ContactAssociationOrmEntity[]> {
    try {
      return await this.repository.find({
        where: {
          contact: { id: contactId },
        },
        relations: ['company', 'deal'],
      });
    } catch (error) {
      throw new InfrastructureError(
        'Failed to load associations for contact',
        error,
      );
    }
  }

  async findContactsForCompany(
    companyId: number,
  ): Promise<ContactAssociationOrmEntity[]> {
    try {
      return await this.repository.find({
        where: {
          company: { id: companyId },
        },
        relations: ['contact'],
      });
    } catch (error) {
      throw new InfrastructureError(
        'Failed to load associations for company',
        error,
      );
    }
  }

  async findContactForDeal(
    dealId: number,
  ): Promise<ContactAssociationOrmEntity | null> {
    try {
      return await this.repository.findOne({
        where: {
          deal: { id: dealId },
        },
        relations: ['contact'],
      });
    } catch (error) {
      throw new InfrastructureError(
        'Failed to load association for deal',
        error,
      );
    }
  }
}
