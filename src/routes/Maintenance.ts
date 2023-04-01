import express from 'express';
import controller from '../controller/Maintenance';

const router = express.Router();

router.get('/AllMaintenance',controller.GetAllMaintenance);
router.post('/AddStatusMaintenance',controller.AddStatusMaintenance)

export = router;