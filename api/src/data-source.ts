import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username:process.env.EUROBOT_DB_USERNAME,
    password:process.env.EUROBOT_DB_PASSWD,
    database:process.env.EUROBOT_DB,
    synchronize: true,
    charset:'utf8mb4',

    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
