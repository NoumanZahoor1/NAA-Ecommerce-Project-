import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

const testApi = async () => {
    try {
        console.log('--- API Tester ---');
        const form = new FormData();

        // We need a real image file to test
        const imagePath = './public/images/sample-tshirt.jpg';
        if (!fs.existsSync(imagePath)) {
            console.error('❌ Sample image not found at ./public/images/sample-tshirt.jpg');
            return;
        }

        form.append('image', fs.createReadStream(imagePath));

        console.log('Sending request to http://localhost:4242/api/visual-search...');
        const response = await fetch('http://localhost:4242/api/visual-search', {
            method: 'POST',
            body: form
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));

    } catch (err) {
        console.error('❌ API Test Failed:');
        console.error(err);
    }
};

testApi();
