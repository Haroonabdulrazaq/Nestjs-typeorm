import { Logger } from "@nestjs/common";
import { MigrationInterface, QueryRunner } from "typeorm";

export class PublicItems1733254215104 implements MigrationInterface {

    private readonly logger = new Logger(PublicItems1733254215104.name)

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Up')
        await queryRunner.query('UPDATE item SET public = 0')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('down')
        await queryRunner.query('UPDATE item SET public = 1')
    }

}
