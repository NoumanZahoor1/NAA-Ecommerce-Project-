import fetch from 'node-fetch';

const checkHealth = async () => {
    try {
        const response = await fetch('http://localhost:4242/api/health');
        const data = await response.json();
        console.log('Health Check Response:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('❌ Health check failed. Is the server running on 4242?');
        console.error(err.message);
    }
};

checkHealth();
