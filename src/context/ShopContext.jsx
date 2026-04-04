import { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();



const initialProducts = [
    // Men's Collection (15 products)
    { id: '5f4d1e2b4f1d4b0017a1a001', name: 'Oversized Hoodie', price: 59.99, category: 'Men', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'], rating: 4.5, stock: 12, sizes: ['S', 'M', 'L', 'XL'], colors: ['black', 'gray'], description: 'Premium cotton blend hoodie', fit: 'Oversized', video: 'https://cdn.coverr.co/videos/coverr-man-walking-in-hoodie-5423/1080p.mp4' },
    { id: '5f4d1e2b4f1d4b0017a1a002', name: 'Slim Fit Jeans', price: 45.00, category: 'Men', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80'], rating: 4.2, stock: 5, sizes: ['30', '32', '34'], colors: ['blue'], description: 'Classic denim', fit: 'Slim' },
    { id: '5f4d1e2b4f1d4b0017a1a004', name: 'Leather Jacket', price: 120.00, category: 'Men', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'], rating: 4.9, stock: 3, sizes: ['M', 'L'], colors: ['black'], description: 'Genuine leather', fit: 'Regular', video: 'https://cdn.coverr.co/videos/coverr-man-adjusting-his-leather-jacket-5421/1080p.mp4' },
    { id: '5f4d1e2b4f1d4b0017a1a007', name: 'Casual Blazer', price: 89.99, category: 'Men', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'], rating: 4.6, stock: 8, sizes: ['M', 'L', 'XL'], colors: ['navy', 'gray'], description: 'Smart casual', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a008', name: 'Graphic T-Shirt', price: 29.99, category: 'Men', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80'], rating: 4.3, stock: 25, sizes: ['S', 'M', 'L', 'XL'], colors: ['white', 'black'], description: 'Trendy graphic', fit: 'Oversized' },
    { id: '5f4d1e2b4f1d4b0017a1a009', name: 'Chino Pants', price: 49.99, category: 'Men', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80'], rating: 4.4, stock: 15, sizes: ['30', '32', '34'], colors: ['khaki', 'navy'], description: 'Versatile chinos', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a010', name: 'Denim Jacket', price: 79.99, category: 'Men', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80'], rating: 4.7, stock: 10, sizes: ['M', 'L', 'XL'], colors: ['blue'], description: 'Classic denim', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a011', name: 'Polo Shirt', price: 39.99, category: 'Men', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=600&q=80'], rating: 4.5, stock: 20, sizes: ['S', 'M', 'L', 'XL'], colors: ['white', 'navy'], description: 'Premium polo', fit: 'Slim' },
    { id: '5f4d1e2b4f1d4b0017a1a012', name: 'Cargo Shorts', price: 34.99, category: 'Men', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80'], rating: 4.2, stock: 18, sizes: ['30', '32', '34'], colors: ['olive', 'khaki'], description: 'Comfortable shorts', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a013', name: 'Bomber Jacket', price: 95.00, category: 'Men', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80'], rating: 4.8, stock: 7, sizes: ['M', 'L', 'XL'], colors: ['black', 'olive'], description: 'Stylish bomber', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a014', name: 'Henley Shirt', price: 35.99, category: 'Men', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80'], rating: 4.4, stock: 22, sizes: ['S', 'M', 'L'], colors: ['gray', 'navy'], description: 'Long sleeve henley', fit: 'Slim' },
    { id: '5f4d1e2b4f1d4b0017a1a015', name: 'Track Pants', price: 44.99, category: 'Men', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&q=80'], rating: 4.3, stock: 16, sizes: ['M', 'L', 'XL'], colors: ['black', 'gray'], description: 'Athletic pants', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a016', name: 'Flannel Shirt', price: 42.99, category: 'Men', image: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=800&q=80'], rating: 4.6, stock: 14, sizes: ['M', 'L', 'XL'], colors: ['red', 'blue'], description: 'Cozy flannel', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a017', name: 'Sweatpants', price: 38.99, category: 'Men', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=600&q=80'], rating: 4.5, stock: 19, sizes: ['S', 'M', 'L', 'XL'], colors: ['gray', 'black'], description: 'Comfortable sweats', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a018', name: 'Oxford Shirt', price: 49.99, category: 'Men', image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=600&q=80'], rating: 4.7, stock: 11, sizes: ['S', 'M', 'L', 'XL'], colors: ['white', 'blue'], description: 'Classic oxford', fit: 'Slim' },
    { id: '5f4d1e2b4f1d4b0017a1a055', name: 'Technical Shell Jacket', price: 145.00, category: 'Men', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'], rating: 4.9, stock: 5, sizes: ['M', 'L', 'XL'], colors: ['black', 'olive'], description: 'Weatherproof technical shell for urban exploration.', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a056', name: 'Knit Polo Sweater', price: 65.00, category: 'Men', image: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=1410&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', images: ['https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=1410&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'], rating: 4.6, stock: 12, sizes: ['S', 'M', 'L'], colors: ['navy', 'gray'], description: 'Soft merino blend knit polo with a sophisticated drape.', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a057', name: 'Pleated Trousers', price: 75.00, category: 'Men', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80'], rating: 4.4, stock: 8, sizes: ['30', '32', '34'], colors: ['charcoal', 'black'], description: 'Tailored pleated trousers for a modern silhouette.', fit: 'Relaxed' },
    { id: '5f4d1e2b4f1d4b0017a1a058', name: 'Utility Vest', price: 55.00, category: 'Men', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'], rating: 4.7, stock: 15, sizes: ['M', 'L'], colors: ['black', 'sand'], description: 'Multi-pocket utility vest with technical hardware.', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a059', name: 'Linen Button-Down', price: 48.00, category: 'Men', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'], rating: 4.5, stock: 20, sizes: ['S', 'M', 'L', 'XL'], colors: ['white', 'blue'], description: 'Breathable 100% linen shirt for warmer climates.', fit: 'Regular' },


    // Women's Collection (15 products)
    { id: '5f4d1e2b4f1d4b0017a1a003', name: 'Summer Dress', price: 39.99, category: 'Women', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80'], rating: 4.8, stock: 20, sizes: ['XS', 'S', 'M'], colors: ['red', 'white'], description: 'Flowy dress', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a006', name: 'Classic Tee', price: 25.00, category: 'Women', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80'], rating: 4.3, stock: 50, sizes: ['S', 'M', 'L'], colors: ['white', 'black'], description: 'Essential tee', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a019', name: 'Maxi Dress', price: 65.99, category: 'Women', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80'], rating: 4.7, stock: 12, sizes: ['XS', 'S', 'M', 'L'], colors: ['floral', 'black'], description: 'Elegant maxi', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a020', name: 'Blazer', price: 79.99, category: 'Women', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=600&q=80'], rating: 4.6, stock: 8, sizes: ['XS', 'S', 'M', 'L'], colors: ['black', 'beige'], description: 'Professional', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a021', name: 'Skinny Jeans', price: 52.99, category: 'Women', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80'], rating: 4.5, stock: 18, sizes: ['26', '28', '30'], colors: ['blue', 'black'], description: 'High-waisted', fit: 'Slim' },
    { id: '5f4d1e2b4f1d4b0017a1a022', name: 'Cardigan', price: 45.99, category: 'Women', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80'], rating: 4.4, stock: 15, sizes: ['S', 'M', 'L'], colors: ['cream', 'gray'], description: 'Cozy knit', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a023', name: 'Midi Skirt', price: 42.99, category: 'Women', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80'], rating: 4.6, stock: 14, sizes: ['XS', 'S', 'M', 'L'], colors: ['black', 'navy'], description: 'Pleated midi', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a024', name: 'Blouse', price: 38.99, category: 'Women', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80'], rating: 4.5, stock: 20, sizes: ['XS', 'S', 'M', 'L'], colors: ['white', 'pink'], description: 'Silk blend', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a025', name: 'Jumpsuit', price: 68.99, category: 'Women', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=600&q=80'], rating: 4.8, stock: 9, sizes: ['XS', 'S', 'M', 'L'], colors: ['black', 'olive'], description: 'Stylish jumpsuit', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a026', name: 'Crop Top', price: 28.99, category: 'Women', image: 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1562137369-1a1a0bc66744?auto=format&fit=crop&w=600&q=80'], rating: 4.3, stock: 25, sizes: ['XS', 'S', 'M'], colors: ['white', 'black'], description: 'Trendy crop', fit: 'Slim' },
    { id: '5f4d1e2b4f1d4b0017a1a027', name: 'Wide Leg Pants', price: 54.99, category: 'Women', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80'], rating: 4.7, stock: 11, sizes: ['XS', 'S', 'M', 'L'], colors: ['black', 'beige'], description: 'Flowy pants', fit: 'Oversized' },
    { id: '5f4d1e2b4f1d4b0017a1a028', name: 'Sweater', price: 48.99, category: 'Women', image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80'], rating: 4.6, stock: 16, sizes: ['S', 'M', 'L'], colors: ['cream', 'brown'], description: 'Chunky knit', fit: 'Oversized', video: 'https://cdn.coverr.co/videos/coverr-fashion-photoshoot-in-studio-4148/1080p.mp4' },
    { id: '5f4d1e2b4f1d4b0017a1a029', name: 'Wrap Dress', price: 59.99, category: 'Women', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'], rating: 4.8, stock: 10, sizes: ['XS', 'S', 'M', 'L'], colors: ['red', 'black'], description: 'Flattering wrap', fit: 'Regular', video: 'https://cdn.coverr.co/videos/coverr-walking-in-a-red-dress-2437/1080p.mp4' },
    { id: '5f4d1e2b4f1d4b0017a1a030', name: 'Tank Top', price: 22.99, category: 'Women', image: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=600&q=80'], rating: 4.4, stock: 30, sizes: ['XS', 'S', 'M', 'L'], colors: ['white', 'black'], description: 'Basic tank', fit: 'Slim' },
    { id: '5f4d1e2b4f1d4b0017a1a031', name: 'Trench Coat', price: 95.99, category: 'Women', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80'], rating: 4.9, stock: 6, sizes: ['XS', 'S', 'M', 'L'], colors: ['beige', 'black'], description: 'Classic trench', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a060', name: 'Satin Slip Dress', price: 78.00, category: 'Women', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'], rating: 4.8, stock: 10, sizes: ['XS', 'S', 'M'], colors: ['emerald', 'black'], description: 'Elegant satin slip dress with a shimmering finish.', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a061', name: 'Cashmere Turtleneck', price: 125.00, category: 'Women', image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80'], rating: 4.9, stock: 7, sizes: ['S', 'M', 'L'], colors: ['cream', 'camel'], description: 'Ultra-soft 100% cashmere turtleneck for ultimate luxury.', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a062', name: 'High-Rise Leather Pants', price: 110.00, category: 'Women', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'], rating: 4.7, stock: 5, sizes: ['24', '26', '28'], colors: ['black'], description: 'Vegan leather pants with a sleek high-waisted fit.', fit: 'Slim' },
    { id: '5f4d1e2b4f1d4b0017a1a063', name: 'Boho Crochet Top', price: 45.00, category: 'Women', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80'], rating: 4.5, stock: 15, sizes: ['S', 'M'], colors: ['white', 'beige'], description: 'Hand-crafted crochet top for an effortless summer look.', fit: 'Relaxed' },
    { id: '5f4d1e2b4f1d4b0017a1a064', name: 'Structured Wool Coat', price: 195.00, category: 'Women', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80'], rating: 5.0, stock: 4, sizes: ['S', 'M', 'L'], colors: ['camel', 'navy'], description: 'Premium wool-blend coat with structured shoulders.', fit: 'Regular' },


    // Accessories (15 products)
    {
        id: '5f4d1e2b4f1d4b0017a1a005',
        name: 'Running Shoes',
        price: 89.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.6, stock: 15, sizes: ['8', '9', '10'], colors: ['white', 'blue'], description: 'Performance shoes', fit: 'Regular',
        model: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/shoe-dr-marten/model.gltf'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a032',
        name: 'Leather Belt',
        price: 35.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.5, stock: 20, sizes: ['S', 'M', 'L'], colors: ['brown', 'black'], description: 'Genuine leather', fit: 'Regular'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a033',
        name: 'Sunglasses',
        price: 45.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.7, stock: 25, sizes: ['One Size'], colors: ['black'], description: 'UV protection', fit: 'Regular'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a034',
        name: 'Backpack',
        price: 65.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1581605405669-fcdf8116543f?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.8, stock: 12, sizes: ['One Size'], colors: ['black', 'gray'], description: 'Durable backpack', fit: 'Regular'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a035',
        name: 'Watch',
        price: 125.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.9, stock: 8, sizes: ['One Size'], colors: ['silver', 'gold'], description: 'Minimalist watch', fit: 'Regular'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a36',
        name: 'Baseball Cap',
        price: 24.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.4, stock: 30, sizes: ['One Size'], colors: ['black', 'navy'], description: 'Classic cap', fit: 'Regular'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a037',
        name: 'Wallet',
        price: 42.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1517254797898-04ecd2010e5c?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.6, stock: 18, sizes: ['One Size'], colors: ['brown', 'black'], description: 'Leather wallet', fit: 'Regular'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a038',
        name: 'Scarf',
        price: 32.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.5, stock: 22, sizes: ['One Size'], colors: ['gray', 'navy'], description: 'Wool blend'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a039',
        name: 'Sneakers',
        price: 75.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-15950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.7, stock: 14, sizes: ['8', '9', '10'], colors: ['white', 'black'], description: 'Casual sneakers', fit: 'Regular'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a040',
        name: 'Tote Bag',
        price: 38.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.6, stock: 16, sizes: ['One Size'], colors: ['beige', 'black'], description: 'Canvas tote', fit: 'Regular'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a041',
        name: 'Beanie',
        price: 19.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.4, stock: 28, sizes: ['One Size'], colors: ['black', 'gray'], description: 'Knit beanie', fit: 'Regular'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a042',
        name: 'Gloves',
        price: 28.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.5, stock: 20, sizes: ['S', 'M', 'L'], colors: ['black', 'brown'], description: 'Leather gloves', fit: 'Regular'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a043',
        name: 'Messenger Bag',
        price: 58.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.7, stock: 10, sizes: ['One Size'], colors: ['brown', 'black'], description: 'Leather messenger', fit: 'Regular'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a044',
        name: 'Socks Pack',
        price: 15.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.3, stock: 40, sizes: ['One Size'], colors: ['multi'], description: '5-pack socks', fit: 'Regular'
    },
    {
        id: '5f4d1e2b4f1d4b0017a1a045',
        name: 'Gym Bag',
        price: 49.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
        images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1581605405669-fcdf8116543f?auto=format&fit=crop&w=600&q=80'
        ],
        rating: 4.6, stock: 13, sizes: ['One Size'], colors: ['black', 'navy'], description: 'Gym duffel', fit: 'Regular'
    },
    { id: '5f4d1e2b4f1d4b0017a1a065', name: 'Technical Running Cap', price: 32.00, category: 'Accessories', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80'], rating: 4.7, stock: 20, sizes: ['One Size'], colors: ['black', 'neon'], description: 'Lightweight tech cap with moisture-wicking fabric.', fit: 'Adjustable' },
    { id: '5f4d1e2b4f1d4b0017a1a066', name: 'Braided Leather Bracelet', price: 28.00, category: 'Accessories', image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80'], rating: 4.5, stock: 15, sizes: ['One Size'], colors: ['brown', 'black'], description: 'Hand-braided genuine leather with magnetic clasp.', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a067', name: 'Merino Wool Scarf', price: 55.00, category: 'Accessories', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'], rating: 4.8, stock: 12, sizes: ['One Size'], colors: ['charcoal', 'navy'], description: 'Extra-long merino wool scarf for extreme warmth.', fit: 'Oversized' },
    { id: '5f4d1e2b4f1d4b0017a1a068', name: 'Oversized Totebag (Nylon)', price: 42.00, category: 'Accessories', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'], rating: 4.6, stock: 18, sizes: ['One Size'], colors: ['black', 'olive'], description: 'Heavy-duty nylon tote for daily essentials.', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a069', name: 'Aviator Sunglasses', price: 58.00, category: 'Accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'], rating: 4.9, stock: 10, sizes: ['One Size'], colors: ['gold', 'silver'], description: 'Classic aviator silhouette with polarized lenses.', fit: 'Regular' },


    // New Arrivals (Mixed Collection)
    { id: '5f4d1e2b4f1d4b0017a1a046', name: 'Abstract Print Shirt', price: 85.00, category: 'new', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80'], rating: 5.0, stock: 10, sizes: ['S', 'M', 'L'], colors: ['multi'], description: 'Limited edition print', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a047', name: 'Tech Runner Vest', price: 110.00, category: 'new', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'], rating: 4.8, stock: 15, sizes: ['M', 'L'], colors: ['black'], description: 'High performance utilitarian', fit: 'Slim' },
    { id: '5f4d1e2b4f1d4b0017a1a048', name: 'Asymmetric Dress', price: 95.00, category: 'new', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'], rating: 4.9, stock: 8, sizes: ['XS', 'S', 'M'], colors: ['black'], description: 'Avant-garde silhouette', fit: 'Regular' },
    { id: '5f4d1e2b4f1d4b0017a1a049', name: 'Metallic Puff Jacket', price: 150.00, category: 'new', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80'], rating: 4.7, stock: 5, sizes: ['M', 'L'], colors: ['silver'], description: 'Statement outerwear', fit: 'Oversized' },
    { id: '5f4d1e2b4f1d4b0017a1a050', name: 'Sheer Overlay Top', price: 65.00, category: 'new', image: 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1562137369-1a1a0bc66744?auto=format&fit=crop&w=600&q=80'], rating: 4.6, stock: 20, sizes: ['S', 'M', 'L'], colors: ['white', 'black'], description: 'Layering essential', fit: 'Slim' },

    // The Archive (Vintage / Rare)
    { id: '5f4d1e2b4f1d4b0017a1a051', name: '1990 Vintage Tee', price: 120.00, category: 'archive', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80'], rating: 5.0, stock: 1, sizes: ['L'], colors: ['faded black'], description: 'Authentic vintage band tee', fit: 'Oversized', salePrice: null },
    { id: '5f4d1e2b4f1d4b0017a1a052', name: 'Distressed Denim Jacket', price: 180.00, category: 'archive', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80'], rating: 4.8, stock: 1, sizes: ['M'], colors: ['indigo'], description: 'Hand-distressed archive piece', fit: 'Regular', salePrice: null },
    { id: '5f4d1e2b4f1d4b0017a1a053', name: 'Wool Military Coat', price: 250.00, category: 'archive', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80'], rating: 4.9, stock: 1, sizes: ['L'], colors: ['olive'], description: 'Surplus vintage outerwear', fit: 'Oversized', salePrice: null },
    { id: '5f4d1e2b4f1d4b0017a1a054', name: 'Patchwork Jeans', price: 200.00, category: 'archive', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80', images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80'], rating: 4.7, stock: 1, sizes: ['32'], colors: ['blue'], description: 'Reworked denim', fit: 'Regular', salePrice: null },
];

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    // Persistence
    useEffect(() => {
        const storedCart = localStorage.getItem('naa_cart');
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse stored cart");
            }
        }

        const storedWishlist = localStorage.getItem('naa_wishlist');
        if (storedWishlist) {
            try {
                setWishlist(JSON.parse(storedWishlist));
            } catch (e) {
                console.error("Failed to parse stored wishlist");
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('naa_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('naa_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products from /api/products...');
                const res = await fetch('/api/products');

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                // Handle new API response format: { products: [], page, pages, total }
                const productsArray = data.products || data;
                console.log(`Successfully fetched ${productsArray.length} products`);

                // Ensure compatibility by mapping _id to id if needed
                const mappedProducts = productsArray.map(p => ({ ...p, id: p._id || p.id }));
                setProducts(mappedProducts);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                // Fallback to initial products if API fails
                console.log('Using fallback products');
                setProducts(initialProducts);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [reviews, setReviews] = useState({}); // { productId: [review1, review2] }

    const addReview = (productId, review) => {
        setReviews(prev => ({
            ...prev,
            [productId]: [review, ...(prev[productId] || [])]
        }));
    };


    const addToCart = (product, size, color) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id && item.size === size && item.color === color);
            if (existing) {
                return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, size, color, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id, size, color) => {
        setCart(prev => prev.filter(item => !(item.id === id && item.size === size && item.color === color)));
    };

    const updateQuantity = (id, size, color, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id && item.size === size && item.color === color) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            if (prev.find(item => item.id === product.id)) {
                return prev.filter(item => item.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <ShopContext.Provider value={{
            products, setProducts,
            cart, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen,
            wishlist, toggleWishlist,
            quickViewProduct, setQuickViewProduct,
            reviews, addReview
        }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);
