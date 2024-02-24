import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1708379999894 implements MigrationInterface {
  name = 'Init1708379999894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "createdAt"`);
  }
}

