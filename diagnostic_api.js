import fetch from 'node-fetch';

async function checkApi() {
    console.log('Checking /api/users/forgotpassword...');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const res = await fetch('http://localhost:4242/api/users/forgotpassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com' }),
            signal: controller.signal
        });
        clearTimeout(timeout);
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response:', text);
    } catch (err) {
        console.error('Error:', err.name === 'AbortError' ? 'Request timed out' : err.message);
    }
}

checkApi();
