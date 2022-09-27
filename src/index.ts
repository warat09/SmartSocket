import express, { Application, Request, Response } from 'express';
import http from "http";

const router: Application = express();

const PORT: number = 9090;
router.use(express.json({ limit: "100mb" }));
router.use(express.urlencoded({ extended: true, limit: "100mb" }));
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
router.get('/', (req: Request, res: Response) => {
    console.log(req.body)
    res.send('Express + TypeScript Server');
});

http
.createServer(router)
.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);