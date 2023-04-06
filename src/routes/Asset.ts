import express from 'express';
import controller from '../controller/Asset';


const router = express.Router();

router.get('/SelectMatchAsset',controller.GetMatchAsset);
router.get('/AllAsset', controller.GetAllAsset);
router.post('/AddAsset', controller.AddAsset);
router.patch('/AllAsset/:id',controller.UpdateStatusAsset)
router.put('/AllAsset/:id',controller.UpdateAsset)


export = router;