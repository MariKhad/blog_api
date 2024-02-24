import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1708365656799 implements MigrationInterface {
  name = 'Init1708365656799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "avatar" character varying NOT NULL DEFAULT 'default_avatar.avif'`,
    );
  }
}

