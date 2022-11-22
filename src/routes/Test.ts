import express from 'express';
import controller from '../controller/test';


const router = express.Router();

router.get('/gettest',controller.GetTest);


export = router;