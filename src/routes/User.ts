import express from 'express';
import controller from '../controller/User';

const router = express.Router();

router.post('/Register', controller.AddUser);
router.post('/CheckToken',controller.CheckToken);
router.get('/AllUser', controller.GetAllUser);

export = router;