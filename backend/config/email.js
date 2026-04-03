import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (options) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email credentials are missing in environment variables (.env)');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // Increase timeout for slow connections
        connectionTimeout: 10000, // 10 seconds
    });

    const mailOptions = {
        from: `NAA Support <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Nodemailer Error:', error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export default sendEmail;
