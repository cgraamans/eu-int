import { MigrationInterface, QueryRunner } from "typeorm"
import {AppDataSource} from "../data-source"
import { User } from "../entity/User";

export class CreateAdminUser1660130925138 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new User();
        user.username = "admin";
        user.password = "admin";
        user.hashPassword();
        user.role = "ADMIN";
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
