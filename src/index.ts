import express, { Application, Request, Response } from 'express';
import http from 'http';
import config from './config/config';
import { AppDataSource } from "../src/data-source"
import Node from './routes/Node';
import User from './routes/User';
import Transection from './routes/Transection';
import Usermatch from './routes/Usermatch';
import Asset from './routes/Asset';
import Match from './routes/Match';
import Test from './routes/Test'

import {auth} from './middleware/auth'
var bodyParser = require('body-parser')


AppDataSource.initialize().then(async () => {

    // create express app
    var cors = require('cors')
    const router: Application = express();
    router.use(bodyParser.json())
    router.use(express.json({ limit: "100mb" }));
    router.use(express.urlencoded({ extended: true, limit: "100mb" }));
    router.use(cors())
    router.use((req: Request, res: Response, next: Function) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With,Content-Type,Accept, Authorization"
        );
        if (req.method === "OPTIONS") {
          res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
          return res.status(200).json({});
        }
        next();
      });

      router.use('/Node', Node);
      router.use('/User', User);
      router.use('/Asset', Asset)
      router.use('/Match', Match)
      router.use('/Transection',Transection)
      router.use('/Usermatch',Usermatch)
      router.use('/test',auth,Test)

    // setup express app here
    // ...

    // start express server
    http
    .createServer(router)
    .listen(config.server.port,() =>
        console.log(`Server is running at http://localhost:${config.server.port}`)
    );

    // // insert new users for test
    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Timber",
    //         lastName: "Saw",
    //         age: 27
    //     })
    // )

    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Phantom",
    //         lastName: "Assassin",
    //         age: 24
    //     })
    // )

}).catch(error => console.log(error))

// require('dotenv').config()
// const mysql = require('mysql2')
// const connection = mysql.createConnection(process.env.DATABASE_URL)
// console.log('Connected to PlanetScale!')
// connection.end()
