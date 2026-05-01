// Native fetch available in Node 18+

const testOrder = async () => {
    const orderData = {
        orderItems: [
            {
                name: 'Test Product',
                quantity: 1,
                image: 'test.jpg',
                price: 100,
                id: '696942a82e44e89eab8acf51' // Existing product ID
            }
        ],
        shippingAddress: {
            address: '123 Test St',
            city: 'Test City',
            postalCode: '12345',
            country: 'US'
        },
        paymentMethod: 'Stripe',
        shippingPrice: 10,
        totalPrice: 110,
        email: 'test@example.com',
        customerName: 'Test User'
    };

    try {
        const response = await fetch('http://localhost:4242/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const text = await response.text();
        console.log('Status:', response.status);
        try {
            const data = JSON.parse(text);
            console.log('Response:', JSON.stringify(data, null, 2));
        } catch (e) {
            console.log('Response (HTML/Text):', text);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testOrder();
