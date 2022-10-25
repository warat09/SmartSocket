import express from 'express';
import controller from '../controller/Node';


const router = express.Router();

router.post('/AddMACAddress', controller.AddMACAddress);
router.get('/AllMACAddress', controller.GetAllMacAddress);

export = router;