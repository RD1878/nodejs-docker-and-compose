import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1756838818474 implements MigrationInterface {
    name = 'Init1756838818474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "offer" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "amount" numeric(10,2) NOT NULL, "hidden" boolean NOT NULL DEFAULT false, "userId" integer, "itemId" integer, CONSTRAINT "PK_57c6ae1abe49201919ef68de900" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wish" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(250) NOT NULL, "link" character varying NOT NULL, "image" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "raised" numeric(10,2) NOT NULL DEFAULT '0', "description" character varying(1024) NOT NULL, "copied" integer NOT NULL DEFAULT '0', "ownerId" integer, CONSTRAINT "PK_e338d8f62014703650439326d3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wishlist" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(250) NOT NULL, "description" character varying(1500) NOT NULL, "image" character varying NOT NULL, "ownerId" integer, CONSTRAINT "PK_620bff4a240d66c357b5d820eaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(30) NOT NULL, "about" character varying(200) NOT NULL DEFAULT 'Пока ничего не рассказал о себе', "avatar" character varying NOT NULL DEFAULT 'https://i.pravatar.cc/300', "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wishlist_items_wish" ("wishlistId" integer NOT NULL, "wishId" integer NOT NULL, CONSTRAINT "PK_bf04498b7fc0b487b15d3b62db0" PRIMARY KEY ("wishlistId", "wishId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e686abff4343ad90ca53a7fc12" ON "wishlist_items_wish" ("wishlistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_20a447bbd8b2e0c58b420300d4" ON "wishlist_items_wish" ("wishId") `);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_e8100751be1076656606ae045e3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_40199af67b763fc3ecc5a0d44e0" FOREIGN KEY ("itemId") REFERENCES "wish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wish" ADD CONSTRAINT "FK_d976be560c304e5396c50bd72c4" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlist" ADD CONSTRAINT "FK_acf92a9b67b36657847695751ba" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "FK_e686abff4343ad90ca53a7fc122" FOREIGN KEY ("wishlistId") REFERENCES "wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "wishlist_items_wish" ADD CONSTRAINT "FK_20a447bbd8b2e0c58b420300d4d" FOREIGN KEY ("wishId") REFERENCES "wish"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "FK_20a447bbd8b2e0c58b420300d4d"`);
        await queryRunner.query(`ALTER TABLE "wishlist_items_wish" DROP CONSTRAINT "FK_e686abff4343ad90ca53a7fc122"`);
        await queryRunner.query(`ALTER TABLE "wishlist" DROP CONSTRAINT "FK_acf92a9b67b36657847695751ba"`);
        await queryRunner.query(`ALTER TABLE "wish" DROP CONSTRAINT "FK_d976be560c304e5396c50bd72c4"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_40199af67b763fc3ecc5a0d44e0"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_e8100751be1076656606ae045e3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20a447bbd8b2e0c58b420300d4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e686abff4343ad90ca53a7fc12"`);
        await queryRunner.query(`DROP TABLE "wishlist_items_wish"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "wishlist"`);
        await queryRunner.query(`DROP TABLE "wish"`);
        await queryRunner.query(`DROP TABLE "offer"`);
    }

}
