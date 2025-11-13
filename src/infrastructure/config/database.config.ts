import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AppDataSource } from '../persistence/typeorm/data-source';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const {
      entities,
      migrations,
      synchronize,
      logging,
      migrationsTableName,
      migrationsRun,
      namingStrategy,
    } = AppDataSource.options;
    
    return {
      type: 'postgres',
      host: this.config.get<string>('database.host'),
      port: this.config.get<number>('database.port'),
      username: this.config.get<string>('database.user.name'),
      password: this.config.get<string>('database.user.password'),
      database: this.config.get<string>('database.name'),
      autoLoadEntities: true,
      entities,
      migrations,
      synchronize,
      logging,
      migrationsTableName,
      migrationsRun,
      namingStrategy
    };
  }
}