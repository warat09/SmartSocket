import express from 'express';
import controller from '../controller/Usermatch';

const router = express.Router();

router.post('/AddUsermatch', controller.AddUsermatch);
router.get('/GetRequestRent', controller.GetRequestRent);
router.get('/GetApprove', controller.GetApprove);
router.get('/AllUsermatch', controller.GetAllUsermatch);

export = router;