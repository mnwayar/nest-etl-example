import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1763057847086 implements MigrationInterface {
    name = 'AutoMigration1763057847086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contacts_status_enum" AS ENUM('ACTIVE', 'ARCHIVED')`);
        await queryRunner.query(`CREATE TABLE "contacts" ("id" SERIAL NOT NULL, "source_id" character varying NOT NULL, "firstname" character varying(255), "lastname" character varying(255), "email" character varying(255), "phone" character varying(50), "status" "public"."contacts_status_enum" NOT NULL DEFAULT 'ACTIVE', "raw" jsonb, "source_url" character varying(255), "source_created_at" TIMESTAMP WITH TIME ZONE, "source_updated_at" TIMESTAMP WITH TIME ZONE, "source_created_year" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_50c16d3ee605f981a45f7425d78" UNIQUE ("source_id"), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP TYPE "public"."contacts_status_enum"`);
    }

}
