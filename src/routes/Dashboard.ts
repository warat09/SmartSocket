import express from 'express';
import controller from '../controller/Dashboard';


const router = express.Router();

router.get('/AllDashboard', controller.GetAllDashboard);

export = router;