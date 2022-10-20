import express from 'express';
import controller from '../controllers/Node';

const router = express.Router();

router.post('/AddMACAddress', controller.AddMACAddress);
router.get('/AllMACAddress', controller.getAllMacaddress);

export = router;