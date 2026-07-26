const nodemailer = require('nodemailer');

const getEmailConfig = () => {
    const host = process.env.EMAIL_HOST || process.env.SMTP_HOST;
    const port = process.env.EMAIL_PORT || process.env.SMTP_PORT;
    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || user;

    if (!host || !port || !user || !pass) {
        return null;
    }

    return { host, port: Number(port), user, pass, from };
};

const sendEmail = async (options) => {
    const config = getEmailConfig();
    if (!config) {
        throw new Error('Email service is not configured');
    }

    try {
        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: String(config.port) === '465',
            auth: {
                user: config.user,
                pass: config.pass
            }
        });

        await transporter.sendMail({
            from: config.from,
            to: options.email,
            subject: options.subject,
            html: options.html
        });

        console.log(`✅ Email sent to ${options.email}`);
    } catch (error) {
        console.log(`❌ Email error: ${error.message}`);
        throw error;
    }
};

module.exports = sendEmail;
module.exports.getEmailConfig = getEmailConfig;