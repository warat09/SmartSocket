import express from 'express';
import controller from '../controller/Node';


const router = express.Router();

router.post('/AddMACAddress', controller.AddMACAddress);
router.post('/SelectNode', controller.SelectMacAddressAsset);
router.get('/AllMACAddress', controller.GetAllMacAddress);
router.patch('/AllMACAddress/:id',controller.UpdateStatusMacAddress)

export = router;