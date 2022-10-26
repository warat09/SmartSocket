import express from 'express';
import controller from '../controller/User';

const router = express.Router();

router.post('/AddUser', controller.AddUser);
router.get('/AllUser', controller.GetAllUser);


export = router;