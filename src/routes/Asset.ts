import express from 'express';
import controller from '../controller/Asset';


const router = express.Router();

router.post('/AddMACAddress', controller.AddAsset);
router.get('/AllMACAddress', controller.GetAllAsset);

export = router;