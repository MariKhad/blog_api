import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1708711557848 implements MigrationInterface {
  name = 'Init1708711557848';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "userId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" ADD "userId" integer NOT NULL`,
    );
  }
}
