import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyRepository } from '../../../core/domain/companies/company.repository';
import { Company } from '../../../core/domain/companies/company.entity';
import { CompanyOrmEntity } from '../typeorm/entities/company.orm-entity';
import { CompanyOrmMapper } from '../typeorm/mappers/company-orm.mapper';

@Injectable()
export class CompanyTypeOrmRepository implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyOrmEntity)
    private readonly repository: Repository<CompanyOrmEntity>,
  ) {}

  async sync(companies: Company[]): Promise<void> {
    if (!companies.length) {
      return;
    }

    const entities = companies.map((company) => {
      return CompanyOrmMapper.toOrm(company);
    });

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(CompanyOrmEntity)
      .values(entities)
      .orUpdate(
        [ 
          'name', 'website_domain', 'status', 'phone', 'city', 'country', 'industry',
          'source_url', 'source_created_at', 'source_updated_at', 'source_created_year',
          'raw', 'updated_at'
        ],
        ['source_id'],
      )
      .execute();
  }

  async findAll() {
    return this.repository.find({
      order: { name: 'ASC' },
    });
  }
}
