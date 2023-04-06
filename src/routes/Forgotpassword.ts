import express from 'express';
import controller from '../controller/Forgotpassword';


const router = express.Router();

router.post('/', controller.ForgotPassword);
router.post("/resetpassword/:token", controller.Presetpassword);
router.get("/resetpassword/:token", controller.tokensendemail);

export = router;