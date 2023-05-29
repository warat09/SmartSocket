import * as dotenv from 'dotenv';

dotenv.config();

const MYSQL_HOST = process.env.host;
const MYSQL_DATABASE = process.env.database;
const MYSQL_USER = process.env.user;
const TOKEN_SECRET = process.env.TOKEN_SECRET|| '';
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

const OAuth2 = {
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    REDIRECT_URI:process.env.REDIRECT_URI,
    REFRESH_TOKEN:process.env.REFRESH_TOKEN
}

const Emailhost = {
    EMAIL_HOST:process.env.EMAIL_HOST,
    PASSCODE_HOST:process.env.PASSCODE_HOST
}

const config = {
    mysql: MYSQL,
    server: SERVER,
    token:TOKEN_SECRET,
    gmail:OAuth2,
    host:Emailhost
};



export default config;