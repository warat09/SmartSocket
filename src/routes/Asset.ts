import express from 'express';
import controller from '../controller/Asset';


const router = express.Router();

router.post('/AddAsset', controller.AddAsset);
router.get('/SelectMatchAsset',controller.GetMatchAsset);
router.get('/AllAsset', controller.GetAllAsset);

export = router;