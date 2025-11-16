import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'etl_user',
  password: process.env.DB_PASS || 'etl_pass',
  database: process.env.DB_NAME || 'etl_db',
  entities: [__dirname + '/entities/*.ts', __dirname + '/entities/*.js'],
  migrations: [__dirname + '/migrations/*.ts', __dirname + '/migrations/*.js'],
  synchronize: false,
  logging: false,
  migrationsTableName: 'system_migrations',
  migrationsRun: false,
  namingStrategy: new SnakeNamingStrategy(),
});
