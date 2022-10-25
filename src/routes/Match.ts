import express from 'express';
import controller from '../controller/Match';

const router = express.Router();

router.post('/MatchingAssets', controller.MatchingAsset);
router.get('/AllMatching',controller.GetAllMatching);

export = router;