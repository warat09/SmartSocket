import express from 'express';
import controller from '../controller/Asset';


const router = express.Router();

router.get('/SelectMatchAsset',controller.GetMatchAsset);
router.get('/AllAsset', controller.GetAllAsset);
router.post('/AddAsset', controller.AddAsset);
router.put('/AllAsset/:id',controller.UpdateAsset)
router.patch('/AllAsset/:id',controller.UpdateStatusAsset)

export = router;