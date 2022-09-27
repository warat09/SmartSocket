import dotenv from 'dotenv';

dotenv.config();

const MYSQL_HOST = process.env.host;
const MYSQL_DATABASE = process.env.database;
const MYSQL_USER = process.env.user;
// const MYSQL_PASS = process.env.password;

const MYSQL = {
    host: MYSQL_HOST,
    database: MYSQL_DATABASE,
    user: MYSQL_USER
    // pass: MYSQL_PASS
};

// const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT;

const SERVER = {
    // hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

const config = {
    mysql: MYSQL,
    server: SERVER
};

export default config;