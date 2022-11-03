import express from 'express';
import controller from '../controller/User';

const router = express.Router();

router.post('/AddUser', controller.AddUser);
router.post('/Login',controller.LoginUser)
router.get('/AllUser', controller.GetAllUser);


export = router;