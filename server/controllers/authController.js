const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

const register = async (req, res) => {
    try {
        const { name, email, password, securityQuestion, securityAnswer } = req.body;

        if (!name || !email || !password || !securityQuestion || !securityAnswer) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, password, security question and answer'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();
        const trimmedAnswer = securityAnswer.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered. Please login.'
            });
        }

        const user = await User.create({ 
            name: trimmedName, 
            email: normalizedEmail, 
            password,
            securityQuestion,
            securityAnswer: trimmedAnswer
        });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registered successfully',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const hashOtp = (otp) =>
    crypto.createHash('sha256').update(String(otp)).digest('hex');

const findUserByEmailAndOtp = async (email, otp) => {
    const normalizedEmail = String(email).trim().toLowerCase();
    const resetPasswordToken = hashOtp(otp);

    return User.findOne({
        email: normalizedEmail,
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        const normalizedEmail = email.trim().toLowerCase();
        user = await User.findOne({ email: normalizedEmail });

        const successResponse = {
            success: true,
            message: 'If an account exists with that email, a 4-digit OTP has been sent.'
        };

        if (!user) {
            return res.status(200).json({
                success: false,
                message: 'No account found.'
            });
        }
            return res.status(200).json(successResponse);
        }

        const otp = user.getResetPasswordOtp();
        await user.save({ validateBeforeSave: false });

        const emailMessage = `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px;">
                <h1 style="color: #6d28d9; margin-bottom: 8px;">QuizForge Password Reset</h1>
                <p style="color: #374151; font-size: 15px;">You requested to reset your password. Use the 4-digit OTP below to proceed:</p>
                <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 12px; margin: 24px 0;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #1e1840;">${otp}</span>
                </div>
                <p style="color: #6b7280; font-size: 13px;">This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
            </div>
        `;

        const hasEmailConfig = !!getEmailConfig();

        if (hasEmailConfig) {
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'QuizForge - 4-Digit Password Reset OTP',
                    html: emailMessage
                });

                return res.status(200).json(successResponse);
            } catch (emailErr) {
                console.error('⚠️ Could not send email via SMTP, falling back to server log mode:', emailErr.message);
            }
        }

        console.log('\n=============================================');
        console.log('--- FORGOT PASSWORD 4-DIGIT OTP GENERATED ---');
        console.log(`User Email : ${user.email}`);
        console.log(`4-Digit OTP: ${otp}`);
        console.log('=============================================\n');

        return res.status(200).json({
            success: true,
            securityQuestion: user.securityQuestion
            ...successResponse,
            message: 'OTP generated and sent to email! (Dev Mode: OTP included below)',
            devOtp: otp
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const verifySecurityAnswer = async (req, res) => {
    try {
        const { email, answer } = req.body;

        if (!email || !answer) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and answer'
            });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });

        if (!user) {
        const cleanOtp = String(otp).trim();
        if (!/^\d{4}$/.test(cleanOtp)) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if locked out
        if (user.securityAnswerLockedUntil && user.securityAnswerLockedUntil > Date.now()) {
            return res.status(403).json({
                success: false,
                message: 'Maximum attempts exceeded. Please try again later.'
            });
        }

        const trimmedAnswer = answer.trim().toLowerCase();
        const isMatch = await user.compareSecurityAnswer(trimmedAnswer);

        if (!isMatch) {
            user.securityAnswerAttempts = (user.securityAnswerAttempts || 0) + 1;
            
            if (user.securityAnswerAttempts >= 3) {
                user.securityAnswerLockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins lock
                await user.save({ validateBeforeSave: false });
                return res.status(403).json({
                    success: false,
                    message: 'Maximum attempts exceeded. Please try again later.'
                });
            }
            
            await user.save({ validateBeforeSave: false });
            return res.status(401).json({
        const user = await findUserByEmailAndOtp(email, cleanOtp);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: `Incorrect answer.\n${3 - user.securityAnswerAttempts} attempts remaining.`,
                remainingAttempts: 3 - user.securityAnswerAttempts
            });
        }

        // Answer is correct, reset attempts
        user.securityAnswerAttempts = 0;
        user.securityAnswerLockedUntil = undefined;
        
        // Generate a temporary reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins validity
        
        await user.save({ validateBeforeSave: false });
                message: 'Invalid or expired OTP. Please request a new code.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Answer verified successfully',
            resetToken
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword, confirmPassword } = req.body;

        if (!email || !resetToken || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, reset token, new password, and confirm password'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (newPassword.length < 6) {
        const cleanOtp = String(otp).trim();
        if (!/^\d{4}$/.test(cleanOtp)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        const user = await findUserByEmailAndOtp(email, cleanOtp);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
                message: 'Invalid or expired OTP. Please request a new code.'
            });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully.'
            message: 'Password reset successfully. You can now login with your new password.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    forgotPassword,
    verifySecurityAnswer,
    resetPassword
};