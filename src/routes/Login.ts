import express from 'express';
import controller from '../controller/Login';


const router = express.Router();

router.post('/', controller.LoginUser);

export = router;