const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { getEmailConfig } = sendEmail;

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

const hashToken = (token) => crypto.createHash('sha256').update(String(token)).digest('hex');

const register = async (req, res) => {
    try {
        const { name, email, password, securityQuestion, securityAnswer } = req.body;

        if (!name || !email || !password || !securityQuestion || !securityAnswer) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, password, security question and answer'
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const trimmedName = String(name).trim();
        const trimmedAnswer = String(securityAnswer).trim().toLowerCase();

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
            token,
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

        const normalizedEmail = String(email).trim().toLowerCase();
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
            token,
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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(200).json({
                success: false,
                message: 'No account found.'
            });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const hasEmailConfig = !!getEmailConfig();

        if (hasEmailConfig) {
            try {
                const emailMessage = `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px;">
                    <h1 style="color: #6d28d9; margin-bottom: 8px;">QuizForge Password Reset</h1>
                    <p style="color: #374151; font-size: 15px;">You requested to reset your password. Use the 4-digit OTP below to proceed:</p>
                    <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 12px; margin: 24px 0;">
                        <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #1e1840;">${otp}</span>
                    </div>
                    <p style="color: #6b7280; font-size: 13px;">If you did not request a password reset, please ignore this email.</p>
                </div>
            `;

                await sendEmail({
                    email: user.email,
                    subject: 'QuizForge - Password Reset OTP',
                    html: emailMessage
                });
            } catch (emailErr) {
                console.error('⚠️ Could not send email via SMTP, falling back to server log mode:', emailErr.message);
            }
        }

        console.log('\n=============================================');
        console.log('--- FORGOT PASSWORD OTP GENERATED ---');
        console.log(`User Email : ${user.email}`);
        console.log(`4-Digit OTP: ${otp}`);
        console.log('=============================================\n');

        return res.status(200).json({
            success: true,
            message: 'Security question ready. Please answer it to continue.',
            securityQuestion: user.securityQuestion,
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

        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.securityAnswerLockedUntil && user.securityAnswerLockedUntil > Date.now()) {
            return res.status(403).json({
                success: false,
                message: 'Maximum attempts exceeded. Please try again later.'
            });
        }

        const trimmedAnswer = String(answer).trim().toLowerCase();
        const isMatch = await user.compareSecurityAnswer(trimmedAnswer);

        if (!isMatch) {
            user.securityAnswerAttempts = (user.securityAnswerAttempts || 0) + 1;

            if (user.securityAnswerAttempts >= 3) {
                user.securityAnswerLockedUntil = Date.now() + 15 * 60 * 1000;
                await user.save({ validateBeforeSave: false });
                return res.status(403).json({
                    success: false,
                    message: 'Maximum attempts exceeded. Please try again later.'
                });
            }

            await user.save({ validateBeforeSave: false });
            return res.status(401).json({
                success: false,
                message: 'Incorrect answer.',
                remainingAttempts: 3 - user.securityAnswerAttempts
            });
        }

        user.securityAnswerAttempts = 0;
        user.securityAnswerLockedUntil = undefined;

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = hashToken(resetToken);
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

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
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const hashedToken = hashToken(resetToken);

        const user = await User.findOne({
            email: normalizedEmail,
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
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
