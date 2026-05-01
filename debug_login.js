
import fetch from 'node-fetch';

async function testLogin() {
    console.log("Testing connection to http://127.0.0.1:4242/api/users/login");
    try {
        const response = await fetch('http://127.0.0.1:4242/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@naa.com', password: 'admin' })
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();
        console.log(`Raw Response: ${text.substring(0, 500)}`); // Print first 500 chars

        try {
            JSON.parse(text);
            console.log("Response IS valid JSON");
        } catch (e) {
            console.log("Response IS NOT valid JSON");
        }
    } catch (error) {
        console.error("Fetch failed:", error.message);
    }
}

testLogin();
