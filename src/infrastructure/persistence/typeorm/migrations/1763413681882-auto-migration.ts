import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1763413681882 implements MigrationInterface {
  name = 'AutoMigration1763413681882';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "deals" ("id" SERIAL NOT NULL, "source_id" character varying NOT NULL, "source_status" "public"."deals_source_status_enum" NOT NULL DEFAULT 'ACTIVE', "source_url" character varying(255), "source_created_at" TIMESTAMP WITH TIME ZONE, "source_updated_at" TIMESTAMP WITH TIME ZONE, "source_archived_at" TIMESTAMP WITH TIME ZONE, "source_created_year" integer, "raw" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255), "stage" character varying(255), "amount" character varying(255), "close_date" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_fb126796015483e0ba2bf4ca6be" UNIQUE ("source_id"), CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "crm_sync_checkpoints" ("id" SERIAL NOT NULL, "object_type" "public"."crm_sync_checkpoints_object_type_enum" NOT NULL, "last_run_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_87595d288053d124f93d2d41458" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contacts" ("id" SERIAL NOT NULL, "source_id" character varying NOT NULL, "source_status" "public"."contacts_source_status_enum" NOT NULL DEFAULT 'ACTIVE', "source_url" character varying(255), "source_created_at" TIMESTAMP WITH TIME ZONE, "source_updated_at" TIMESTAMP WITH TIME ZONE, "source_archived_at" TIMESTAMP WITH TIME ZONE, "source_created_year" integer, "raw" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "firstname" character varying(255), "lastname" character varying(255), "email" character varying(255), "phone" character varying(50), CONSTRAINT "UQ_50c16d3ee605f981a45f7425d78" UNIQUE ("source_id"), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "companies" ("id" SERIAL NOT NULL, "source_id" character varying NOT NULL, "source_status" "public"."companies_source_status_enum" NOT NULL DEFAULT 'ACTIVE', "source_url" character varying(255), "source_created_at" TIMESTAMP WITH TIME ZONE, "source_updated_at" TIMESTAMP WITH TIME ZONE, "source_archived_at" TIMESTAMP WITH TIME ZONE, "source_created_year" integer, "raw" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255), "website_domain" character varying(255), "phone" character varying(50), "city" character varying(50), "country" character varying(50), "industry" character varying(255), CONSTRAINT "UQ_f2e423d7699c5fdaf8787ef6de7" UNIQUE ("source_id"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contact_associations" ("id" SERIAL NOT NULL, "contact_source_id" character varying(255) NOT NULL, "target_source_id" character varying(255) NOT NULL, "target_type" "public"."contact_associations_target_type_enum" NOT NULL, "association_type_id" integer, "association_label" character varying(255), "association_category" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "contact_id" integer, "company_id" integer, "deal_id" integer, CONSTRAINT "PK_8453b4621206f6f4ce4f64b63d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_contact_target_type" ON "contact_associations" ("contact_source_id", "target_source_id", "target_type") `,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_associations" ADD CONSTRAINT "FK_01206bba20808128b3a08e849f2" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_associations" ADD CONSTRAINT "FK_67c31c7c610218a4b09d5e34fac" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_associations" ADD CONSTRAINT "FK_c11b16ff0d073576d4352669968" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contact_associations" DROP CONSTRAINT "FK_c11b16ff0d073576d4352669968"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_associations" DROP CONSTRAINT "FK_67c31c7c610218a4b09d5e34fac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_associations" DROP CONSTRAINT "FK_01206bba20808128b3a08e849f2"`,
    );
    await queryRunner.query(`DROP INDEX "public"."uq_contact_target_type"`);
    await queryRunner.query(`DROP TABLE "contact_associations"`);
    await queryRunner.query(`DROP TABLE "companies"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TABLE "crm_sync_checkpoints"`);
    await queryRunner.query(`DROP TABLE "deals"`);
  }
}
