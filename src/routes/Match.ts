import express from 'express';
import controller from '../controller/Match';

const router = express.Router();

router.post('/MatchingAssets', controller.MatchingAsset);
router.get('/SelectRentMatch',controller.GetRentMatch);
router.get('/SelectMaintenance',controller.GetAssetMaintenance);
router.get('/AllMatching',controller.GetAllMatching);
router.patch('/AllMatching/:id',controller.UpdateStatusMatching)
router.put('/AllMatching/:id',controller.UpdateMatching)

export = router;