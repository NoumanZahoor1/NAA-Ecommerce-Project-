
import fetch from 'node-fetch';

async function testChat() {
    try {
        const response = await fetch('http://localhost:4242/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'hello' }]
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testChat();
