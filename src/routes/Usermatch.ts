import express from 'express';
import controller from '../controller/Usermatch';

const router = express.Router();

router.post('/AddUsermatch', controller.AddUsermatch);
router.post('/GetRequestRent', controller.GetRequestRent);
router.get('/AllUsermatch', controller.GetAllUsermatch);


export = router;