import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '@infra/config/app.config';
import { DatabaseConfig } from '@infra/config/database.config';
import { EtlModule } from '@infra/etl/etl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig],
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'local'}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    EtlModule,
  ],
  providers: [DatabaseConfig],
})
export class EtlRunnerModule {}
