
import fetch from 'node-fetch';

const BASE_URL = 'http://127.0.0.1:4242';

// NOTE: This script assumes the server is running.
// It also needs a valid user token to test authenticated requests.
// Since I don't have a fresh token here, I will primarily test the error responses
// and the JSON format of rate limits.

const testReviewLogic = async () => {
    console.log('--- STARTING REVIEW LOGIC VERIFICATION ---');

    // 1. Test Review Route without token (Should return standardized JSON error)
    try {
        console.log('\n1. Testing POST /api/reviews without token...');
        const res = await fetch(`${BASE_URL}/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: 'some-id', rating: 5, comment: 'test' })
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${JSON.stringify(data)}`);
        if (res.status === 401 && data.message === 'Not authorized, no token') {
            console.log('✅ PASS: Correct JSON error for missing token');
        } else {
            console.log('❌ FAIL: Unexpected response for missing token');
        }
    } catch (err) {
        console.error('Error during test 1:', err.message);
    }

    // 2. Test Rate Limit (Hitting /api/users/login multiple times)
    try {
        console.log('\n2. Testing Rate Limit on /api/users/login...');
        for (let i = 0; i < 7; i++) {
            const res = await fetch(`${BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'nonexistent@example.com', password: 'wrong' })
            });
            if (res.status === 429) {
                const data = await res.json();
                console.log(`Iteration ${i + 1}: Status: 429`);
                console.log(`Response: ${JSON.stringify(data)}`);
                if (data.message && data.message.includes('Too many login attempts')) {
                    console.log('✅ PASS: Standardized JSON rate limit message received');
                } else {
                    console.log('❌ FAIL: Rate limit message not in expected JSON format');
                }
                break;
            } else {
                console.log(`Iteration ${i + 1}: Status: ${res.status}`);
            }
        }
    } catch (err) {
        console.error('Error during test 2:', err.message);
    }

    console.log('\n--- VERIFICATION FINISHED ---');
};

testReviewLogic();
