import express from 'express';
import controller from '../controller/Forgotpassword';


const router = express.Router();

router.post('/', controller.ForgotPassword);
router.post("/send_recovery_email", controller.RecoveryEmail);

export = router;