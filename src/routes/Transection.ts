import express from 'express';
import controller from '../controller/Transection';

const router = express.Router();

router.post('/SendTransection', controller.SendTransection);


export = router;