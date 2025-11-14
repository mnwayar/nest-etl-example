import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1762956926502 implements MigrationInterface {
  name = 'AutoMigration1762956926502';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."companies_status_enum" AS ENUM('ACTIVE', 'ARCHIVED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "companies" ("id" SERIAL NOT NULL, "source_id" character varying NOT NULL, "name" character varying(255), "website_domain" character varying(255), "phone" character varying(50), "city" character varying(50), "country" character varying(50), "industry" character varying(255), "status" "public"."companies_status_enum" NOT NULL DEFAULT 'ACTIVE', "raw" jsonb, "source_url" character varying(255), "source_created_at" TIMESTAMP WITH TIME ZONE, "source_updated_at" TIMESTAMP WITH TIME ZONE, "source_created_year" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f2e423d7699c5fdaf8787ef6de7" UNIQUE ("source_id"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "companies"`);
    await queryRunner.query(`DROP TYPE "public"."companies_status_enum"`);
  }
}
