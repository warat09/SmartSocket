import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "smart_db",
    synchronize: true,
    logging: false,
    entities: ["src/entity/*.ts"],
    migrations: [ "src/migration/**/*.ts" ], 
   subscribers: [ "src/subscriber/**/*.ts"]
})
