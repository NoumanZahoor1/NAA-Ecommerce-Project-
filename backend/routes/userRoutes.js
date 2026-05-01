import express from 'express';
import { authUser, registerUser, getUsers } from '../controllers/userController.js';
import { forgotPassword, resetPassword } from '../controllers/passwordResetController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/login', loginValidation, authUser);
router.post('/forgotpassword', forgotPasswordValidation, forgotPassword);
router.put('/resetpassword/:resetToken', resetPasswordValidation, resetPassword);
router.route('/').post(registerValidation, registerUser).get(protect, admin, getUsers);

export default router;
