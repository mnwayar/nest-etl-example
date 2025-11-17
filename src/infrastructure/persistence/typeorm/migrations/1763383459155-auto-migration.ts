import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1763383459155 implements MigrationInterface {
    name = 'AutoMigration1763383459155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deals" ("id" SERIAL NOT NULL, "source_id" character varying NOT NULL, "source_status" "public"."deals_source_status_enum" NOT NULL DEFAULT 'ACTIVE', "source_url" character varying(255), "source_created_at" TIMESTAMP WITH TIME ZONE, "source_updated_at" TIMESTAMP WITH TIME ZONE, "source_archived_at" TIMESTAMP WITH TIME ZONE, "source_created_year" integer, "raw" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255), "stage" character varying(255), "amount" character varying(255), "close_date" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_fb126796015483e0ba2bf4ca6be" UNIQUE ("source_id"), CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "crm_sync_checkpoints" ("id" SERIAL NOT NULL, "object_type" "public"."crm_sync_checkpoints_object_type_enum" NOT NULL, "last_run_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_87595d288053d124f93d2d41458" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contacts" ("id" SERIAL NOT NULL, "source_id" character varying NOT NULL, "source_status" "public"."contacts_source_status_enum" NOT NULL DEFAULT 'ACTIVE', "source_url" character varying(255), "source_created_at" TIMESTAMP WITH TIME ZONE, "source_updated_at" TIMESTAMP WITH TIME ZONE, "source_archived_at" TIMESTAMP WITH TIME ZONE, "source_created_year" integer, "raw" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "firstname" character varying(255), "lastname" character varying(255), "email" character varying(255), "phone" character varying(50), CONSTRAINT "UQ_50c16d3ee605f981a45f7425d78" UNIQUE ("source_id"), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies" ("id" SERIAL NOT NULL, "source_id" character varying NOT NULL, "source_status" "public"."companies_source_status_enum" NOT NULL DEFAULT 'ACTIVE', "source_url" character varying(255), "source_created_at" TIMESTAMP WITH TIME ZONE, "source_updated_at" TIMESTAMP WITH TIME ZONE, "source_archived_at" TIMESTAMP WITH TIME ZONE, "source_created_year" integer, "raw" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255), "website_domain" character varying(255), "phone" character varying(50), "city" character varying(50), "country" character varying(50), "industry" character varying(255), CONSTRAINT "UQ_f2e423d7699c5fdaf8787ef6de7" UNIQUE ("source_id"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP TABLE "crm_sync_checkpoints"`);
        await queryRunner.query(`DROP TABLE "deals"`);
    }

}
