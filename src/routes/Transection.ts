import express from 'express';
import controller from '../controllers/Transection';

const router = express.Router();

router.post('/SendTransection', controller.SendTransection);
router.post('/Sendtest', controller.SendTest);


export = router;