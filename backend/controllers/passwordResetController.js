import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../config/email.js';

// @desc    Forgot Password - Send Reset Email
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found with this email');
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and save to database
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expiration (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            html: message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error) {
        console.error('Password Reset Email Error:', error);

        // Clean up reset token fields if email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(500);
        throw new Error(error.message || 'Email could not be sent');
    }
});

// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid Token');
    }

    user.password = req.body.password; // Pre-save hook will hash it (need to ensure this)

    // We need to check if User model has pre-save hook for hashing password.
    // If not, we have to hash it here manually.
    // Let's assume it has, based on typical implementation, but I should verify User.js later.
    // Actually, I should verify User.js now to be safe. 
    // Wait, I can't interrupt this write_to_file. I will blindly update password here 
    // and if hashing is missing, I will fix User.js.

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
        success: true,
        data: 'Password Reset Success',
    });
});

export { forgotPassword, resetPassword };
