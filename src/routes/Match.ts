import express from 'express';
import controller from '../controllers/Match';

const router = express.Router();

router.post('/MatchingAssets', controller.MatchingAsset);
router.get('/AllMatching',controller.getAllMatching)
export = router;