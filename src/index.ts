import express, { Application, Request, Response } from 'express';
import http from 'http';
import config from './config/config';
import { AppDataSource } from "../src/data-source"
import Login from './routes/Login';
import Node from './routes/Node';
import User from './routes/User';
import Transaction from './routes/Transaction';
import Usermatch from './routes/Usermatch';
import Asset from './routes/Asset';
import Match from './routes/Match';
import Dashboard from './routes/Dashboard';
import Rfid from './routes/Rfid';

import {auth} from './middleware/auth'
import nodemailer from 'nodemailer';

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
          "Origin, X-Requested-With,Content-Type,Accept, Authorization",
        );
        if (req.method === "OPTIONS") {
          res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
          return res.status(200).json({});
        }
        next();
      });
      router.use('/Login',Login)
      router.use('/Node', Node);
      router.use('/User',auth,User);
      router.use('/Rfid',Rfid);
      router.use('/Asset', Asset)
      router.use('/Match', Match)
      router.use('/Transaction',Transaction)
      router.use('/Usermatch',auth,Usermatch)
      router.use('/Dashboard',auth,Dashboard)
      router.post('/email',async(req:Request,res:Response)=>{
        const {google} = require('googleapis');
        const CLIENT_ID =
      "901872679791-l5ssb10p617vt6mo4q2b3u61dgn4tt2u.apps.googleusercontent.com";
      const CLIENT_SECRET = "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";
      const REDIRECT_URI = "https://developers.google.com/oauthplayground";
      const REFRESH_TOKEN ="1//04zNGhLAs-v8TCgYIARAAGAQSNwF-L9IrFX06Q5U84zMDsJS96vmstZePoN1JU3lsggqqBP5k5XHJyRXCnRARjqlPU32bXoNPMWw";
      const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI,
        REFRESH_TOKEN
      );
      oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        let {email} = req.body 
        const accessToken = await oAuth2Client.getAccessToken();
                const transport = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    type: "OAuth2",
                    user: "SmartSocket@gmail.com",
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken,
                  },
                });
                const mailOptions = {
                  from: "beebacorporation <beebacorporation@gmail.com>",
                  to: email,
                  subject: "มีการสมัครสมาชิกผ่านอีเมลของคุณ"}
                  await transport.sendMail(mailOptions).then(
                    res.json({
                      message: "Email is sent please check you Email",
                    })
                  );
      })
    http
    .createServer(router)
    .listen(config.server.port,() =>
        console.log(`Server is running at http://localhost:${config.server.port}`)
    );

}).catch(error => console.log(error))
