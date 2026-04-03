import http from 'http';

const testConnect = (host) => {
    return new Promise((resolve) => {
        const req = http.get(`http://${host}:4242/test`, (res) => {
            console.log(`Successfully connected to ${host}:4242`);
            resolve(true);
        });

        req.on('error', (err) => {
            console.log(`Failed to connect to ${host}:4242 - Error: ${err.message}`);
            resolve(false);
        });

        req.end();
    });
};

async function run() {
    console.log('Testing connectivity...');
    await testConnect('localhost');
    await testConnect('127.0.0.1');
    await testConnect('0.0.0.0');
}

run();
