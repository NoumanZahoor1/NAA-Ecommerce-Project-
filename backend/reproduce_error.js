
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4242';

const reproduceError = async () => {
    try {
        console.log(`\n--- REPRODUCING LOGIN ERROR ---`);
        console.log(`Attempting login with WRONG password...`);

        const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@naa.com', password: 'admin' })
        });

        console.log(`Response Status: ${loginRes.status}`);
        const contentType = loginRes.headers.get('content-type');
        console.log(`Response Content-Type: ${contentType}`);

        const text = await loginRes.text();
        console.log(`Body start (first 500 chars):\n${text.substring(0, 500)}`);

        if (contentType && contentType.includes('application/json')) {
            console.log('PASS: Server returned JSON error.');
        } else {
            console.log('FAIL: Server returned HTML/Text error.');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
};

reproduceError();
