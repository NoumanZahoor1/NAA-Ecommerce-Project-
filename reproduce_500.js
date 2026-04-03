
import fetch from 'node-fetch';

const BASE_URL = 'http://127.0.0.1:4242';

const reproduce = async () => {
    try {
        console.log('--- Step 1: Login ---');
        const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@naa.com', password: 'admin' })
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(`Login failed: ${loginData.message}`);

        const token = loginData.token;
        console.log('✅ Login successful');

        console.log('\n--- Step 2: Post Review for non-existent product ---');
        const reviewRes = await fetch(`${BASE_URL}/api/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: '5f4d1e2b4f1d4b0017a1a003',
                rating: 5,
                comment: 'Reproduction test'
            })
        });

        console.log(`Status: ${reviewRes.status}`);
        const contentType = reviewRes.headers.get('content-type');
        console.log(`Content-Type: ${contentType}`);

        const data = await reviewRes.json();
        console.log('Response Body:', JSON.stringify(data, null, 2));

        if (reviewRes.status === 404) {
            console.log('✅ PASS: Correctly returned 404 JSON for missing product.');
        } else {
            console.log('❌ FAIL: Expected 404, got', reviewRes.status);
        }

    } catch (err) {
        console.error('Error:', err.message);
    }
};

reproduce();
