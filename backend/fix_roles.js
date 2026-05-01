
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const fixRoles = async () => {
    try {
        await connectDB();

        console.log(`\n--- FIXING USER ROLES ---`);

        // 1. Demote nomijatoi456@gmail.com
        const customerEmail = 'nomijatoi456@gmail.com';
        const customer = await User.findOne({ email: customerEmail });

        if (customer) {
            customer.isAdmin = false;
            await customer.save();
            console.log(`SUCCESS: Demoted ${customer.name} (${customerEmail}) to regular CUSTOMER.`);
        } else {
            console.log(`Customer ${customerEmail} not found.`);
        }

        // 2. Ensure admin@naa.com exists and is Admin
        const adminEmail = 'admin@naa.com';
        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            if (!admin.isAdmin) {
                admin.isAdmin = true;
                await admin.save();
                console.log(`SUCCESS: Promoted existing user ${adminEmail} to ADMIN.`);
            } else {
                console.log(`VERIFIED: ${adminEmail} is already an ADMIN.`);
            }
        } else {
            console.log(`WARNING: Admin user ${adminEmail} does not exist. Creating default admin...`);
            // Create default admin if missing
            admin = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: 'adminpassword', // You typically hash this, but the model pre-save hook might handle it
                isAdmin: true
            });
            console.log(`SUCCESS: Created new ADMIN user ${adminEmail} with password 'adminpassword'`);
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

fixRoles();
