const mongoose = require('mongoose');
const uri = 'mongodb+srv://nomijatoi456_db_user:dbnouman123@cluster0.zn2cift.mongodb.net/naa-shop?appName=Cluster0';

async function updateProduct() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
        
        const newImageUrl = 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=1410&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        
        const result = await mongoose.connection.db.collection('products').updateOne(
            { name: 'Knit Polo Sweater' },
            { 
                $set: { 
                    image: newImageUrl,
                    images: [newImageUrl],
                    fit: 'Regular'
                } 
            }
        );
        
        console.log('Update Result:', result);
        process.exit(0);
    } catch (err) {
        console.error('Update Error:', err);
        process.exit(1);
    }
}

updateProduct();
