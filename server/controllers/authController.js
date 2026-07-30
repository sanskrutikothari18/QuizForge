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
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and password'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered. Please login.'
            });
        }

        const user = await User.create({ name: trimmedName, email: normalizedEmail, password });
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
    let user;
    try {
        const { getEmailConfig } = require('../utils/sendEmail');
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        user = await User.findOne({ email: normalizedEmail });

        const successResponse = {
            success: true,
            message: 'If an account exists with that email, a 4-digit OTP has been sent.'
        };

        if (!user) {
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
            ...successResponse,
            message: 'OTP generated and sent to email! (Dev Mode: OTP included below)',
            devOtp: otp
        });

    } catch (error) {
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            try {
                await user.save({ validateBeforeSave: false });
            } catch (saveError) {
                console.error('Error clearing reset OTP:', saveError.message);
            }
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and OTP'
            });
        }

        const cleanOtp = String(otp).trim();
        if (!/^\d{4}$/.test(cleanOtp)) {
            return res.status(400).json({
                success: false,
                message: 'OTP must be a 4-digit number'
            });
        }

        const user = await findUserByEmailAndOtp(email, cleanOtp);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP. Please request a new code.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
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
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, OTP, and new password'
            });
        }

        const cleanOtp = String(otp).trim();
        if (!/^\d{4}$/.test(cleanOtp)) {
            return res.status(400).json({
                success: false,
                message: 'OTP must be a 4-digit number'
            });
        }

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
                message: 'Invalid or expired OTP. Please request a new code.'
            });
        }

        user.password = password;
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
    verifyOtp,
    resetPassword
};