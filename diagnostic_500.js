
import fetch from 'node-fetch';

const BASE_URL = 'http://127.0.0.1:4242';

const testError = async () => {
    console.log('--- DIAGNOSTIC: Testing /api/reviews directly ---');
    try {
        // We test with a junk ID to see if we get a 404/400 JSON or a 500 HTML
        const res = await fetch(`${BASE_URL}/api/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:5173'
                // We'll try without a token first to see if auth catches it correctly
            },
            body: JSON.stringify({
                productId: '5f4d1e2b4f1d4b0017a1a003',
                rating: 5,
                comment: 'Diagnostic test'
            })
        });

        console.log(`Status: ${res.status}`);
        const contentType = res.headers.get('content-type');
        console.log(`Content-Type: ${contentType}`);

        const text = await res.text();
        console.log(`Response Body: ${text.substring(0, 500)}`);

        if (text.startsWith('<!DOCTYPE html>')) {
            console.log('❌ FAIL: Server returned HTML instead of JSON.');
        } else {
            console.log('✅ INFO: Server returned non-HTML (probably JSON error).');
        }
    } catch (err) {
        console.error('Connection Error:', err.message);
    }
};

testError();
