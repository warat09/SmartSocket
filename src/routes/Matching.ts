import express from 'express';
import controller from '../controllers/Matching';

const router = express.Router();

router.post('/MatchingAssets', controller.MatchingAsset);
router.get('/AllMatching',controller.getAllMatching)
export = router;