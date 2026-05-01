
import fetch from 'node-fetch';

const BASE_URL = 'http://127.0.0.1:4242';

const testForgotPassword = async () => {
    console.log('--- TESTING FORGOT PASSWORD ---');
    try {
        const res = await fetch(`${BASE_URL}/api/users/forgotpassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'nomijatoi456@gmail.com' })
        });

        console.log(`Status: ${res.status}`);
        const data = await res.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    }
};

testForgotPassword();
