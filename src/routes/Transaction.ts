import express from 'express';
import controller from '../controller/Transaction';

const router = express.Router();

router.post('/SendTransaction', controller.SendTransaction);
router.get('/AllTransaction',controller.GetAllTransaction);


export = router;