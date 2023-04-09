import express from 'express';
import controller from '../controller/Usermatch';
import {verifyRoles} from '../middleware/verifyRoles'

const router = express.Router();

router.post('/AddUsermatch',verifyRoles("admin","user"),controller.AddUsermatch);
router.get('/GetRequestRent', controller.GetRequestRent);
router.get('/GetApprove', controller.GetApprove);
router.get('/AllUsermatch', controller.GetAllUsermatch);
router.put('/AllUsermatch/:id',controller.UpdateUsermatch)
router.put('/ReturnAssets/:id',controller.ReturnAssets)
router.patch('/Approve/:id',controller.UpdateStatusApprove);

export = router;