import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyRepository } from '@core/domain/companies/company.repository';
import { Company } from '@core/domain/companies/company.entity';
import { InfrastructureError } from '@shared/errors';
import { CompanyOrmEntity } from '../typeorm/entities/company.orm-entity';
import { CompanyOrmMapper } from '../typeorm/mappers/company-orm.mapper';

@Injectable()
export class CompanyTypeOrmRepository implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyOrmEntity)
    private readonly repository: Repository<CompanyOrmEntity>,
  ) {}

  async syncFromSource(companies: Company[]): Promise<void> {
    if (!companies.length) {
      return;
    }

    const entities = companies.map((company) => {
      return CompanyOrmMapper.toOrm(company);
    });

    try {
      await this.repository
        .createQueryBuilder()
        .insert()
        .into(CompanyOrmEntity)
        .values(entities)
        .orUpdate(
          [
            'name',
            'website_domain',
            'source_status',
            'phone',
            'city',
            'country',
            'industry',
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
    } catch (error) {
      throw new InfrastructureError('Failed to sync companies', error);
    }
  }

  async getAll(): Promise<Company[]> {
    try {
      const companies = await this.repository.find({
        order: { id: 'ASC' },
      });

      return companies.map((company) => {
        return CompanyOrmMapper.toDomain(company);
      });
    } catch (error) {
      throw new InfrastructureError('Failed to load companies', error);
    }
  }

  async getById(id: string): Promise<Company | null> {
    try {
      const company = await this.repository.findOne({
        where: {
          sourceId: id,
        },
        relations: ['contactAssociations', 'contactAssociations.contact'],
      });

      if (!company) return null;

      return CompanyOrmMapper.toDomain(company);
    } catch (error) {
      throw new InfrastructureError('Failed to load company', error);
    }
  }
}
