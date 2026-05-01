import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (options) => {

    // PRIMARY: Use Resend API (works on Vercel serverless - no SMTP blocking)
    if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { error } = await resend.emails.send({
            from: 'NAA Support <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            html: options.html,
        });

        if (error) {
            console.error('Resend Error:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }

        console.log(`✅ Email sent via Resend to ${options.email}`);
        return;
    }

    // FALLBACK: nodemailer for local dev (when RESEND_API_KEY not set)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email credentials missing. Set RESEND_API_KEY or EMAIL_USER/EMAIL_PASS in .env');
    }

    const emailPass = process.env.EMAIL_PASS.replace(/\s+/g, '');

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: emailPass,
        },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
    });

    try {
        await transporter.sendMail({
            from: `NAA Support <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });
        console.log(`✅ Email sent via nodemailer to ${options.email}`);
    } catch (error) {
        console.error('Nodemailer Error:', error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export default sendEmail;

