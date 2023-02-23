import express from 'express';
import controller from '../controller/User';
import {verifyRoles} from '../middleware/verifyRoles'

const router = express.Router();

router.post('/Register', controller.AddUser);
router.post('/CheckToken',controller.CheckToken);
router.get('/AllUser',verifyRoles("admin"),controller.GetAllUser);

export = router;