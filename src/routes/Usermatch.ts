import express from 'express';
import controller from '../controller/Usermatch';

const router = express.Router();

router.post('/AddUsermatch', controller.AddUsermatch);
router.get('/AllUsermatch', controller.GetAllUsermatch);


export = router;