import express from 'express';
import controller from '../controllers/User';

const router = express.Router();

router.post('/AddUser', controller.AddUser);
router.post('/AllUser', controller.GetAllUser);


export = router;