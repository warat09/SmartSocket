import express from 'express';
import controller from '../controller/Rfid';


const router = express.Router();

router.post('/AddAddressRfid', controller.AddAddressRfid);
router.get('/SelectRfidAsset',controller.GetRfidAsset);

export = router;