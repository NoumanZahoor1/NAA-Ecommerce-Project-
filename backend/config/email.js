import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (options) => {
    // DEVELOPMENT LOGGING: Always log the email content to console in dev mode
    // This ensures you can always see reset links even if email services fail
    if (process.env.NODE_ENV === 'development') {
        console.log('\n--- DEVELOPMENT EMAIL START ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log('Content (HTML):', options.html);
        console.log('--- DEVELOPMENT EMAIL END ---\n');
    }

    // PRIMARY: Use Resend API
    if (process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);

            const { error } = await resend.emails.send({
                from: 'NAA Support <onboarding@resend.dev>',
                to: options.email,
                subject: options.subject,
                html: options.html,
            });

            if (!error) {
                console.log(`✅ Email sent via Resend to ${options.email}`);
                return;
            }

            console.warn('Resend Error (Trying fallback):', error.message);
            // If it's the "testing email" restriction, we'll continue to the fallback
        } catch (err) {
            console.warn('Resend Exception (Trying fallback):', err.message);
        }
    }

    // FALLBACK: nodemailer for local dev (when RESEND_API_KEY not set or fails)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        // If we are in dev and logged to console, we can just return instead of throwing
        if (process.env.NODE_ENV === 'development') {
            console.log('ℹ️ Email sending skipped (Dev mode: link logged above)');
            return;
        }
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
        // In dev, we don't want to crash if we already logged to console
        if (process.env.NODE_ENV === 'development') {
            console.log('ℹ️ Nodemailer failed, but dev link was logged to console.');
            return;
        }
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export default sendEmail;

