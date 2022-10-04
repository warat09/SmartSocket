import express from 'express';
import controller from '../controllers/Asset';

const router = express.Router();

router.post('/AddAssets', controller.AddAsset);
router.get('/AllAssets',controller.GetAllAsset);

export = router;