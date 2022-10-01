import express, { Application, Request, Response } from 'express';
import http from 'http';
import config from './config/config';
import {Connect} from "./config/mysql";
import MACRoutes from './routes/M.A.C';


var cors = require('cors')
const router: Application = express();

Connect().then(()=>{
  StartServer()
}).catch((err)=>{
  console.log("not connect db",err)
})
const StartServer = () => {
  router.use(express.json({ limit: "100mb" }));
  router.use(express.urlencoded({ extended: true, limit: "100mb" }));
  router.use(cors())
  router.use((req, res, next) => {
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

    router.use('/MACAddress', MACRoutes);
  // router.get('/', (req: Request, res: Response) => {
  //     console.log(req.body)
  //     res.send('get + TypeScript Server');
  // });
  router.post('/', (req: Request, res: Response) => {
    console.log(req.body.count);
    res.send(`count = ${req.body.count}`);
  });

  http
  .createServer(router)
  .listen(config.server.port,() =>
    console.log(`Server is running at http://localhost:${config.server.port}`)
  );
}
