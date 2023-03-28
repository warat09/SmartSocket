import express from 'express';
import controller from '../controller/Maintenance';

const router = express.Router();

router.get('/AllMaintenance',controller.GetAllMaintenance);

export = router;