import express from 'express';
import controller from '../controllers/Matching';

const router = express.Router();

router.post('/MatchingAssets', controller.MatchingAsset);

export = router;