import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1715444795946 implements MigrationInterface {
  name = 'InitialMigration1715444795946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "card" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "hp" integer NOT NULL, "attack" integer NOT NULL, "weakness" character varying NOT NULL, "resistance" character varying NOT NULL, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "card"`);
  }
}
