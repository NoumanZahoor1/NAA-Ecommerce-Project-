import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';

const AdminProducts = () => {
    const { products, setProducts } = useShop();
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: 'Men',
        description: '',
        images: [],
        salePrice: '',
        saleStartDate: '',
        saleEndDate: ''
    });

    const handleEdit = (product) => {
        console.log('Editing product:', product);
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.countInStock || product.stock || 0,
            category: product.category,
            description: product.description || '',
            images: product.images || (product.image ? [product.image] : []),
            salePrice: product.salePrice || '',
            saleStartDate: product.saleStartDate ? product.saleStartDate.substring(0, 10) : '',
            saleEndDate: product.saleEndDate ? product.saleEndDate.substring(0, 10) : ''
        });
        setIsEditing(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const productData = {
            name: formData.name,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            category: formData.category,
            description: formData.description,
            image: formData.images[0] || '', // Main image is the first one
            images: formData.images,
            salePrice: formData.salePrice ? parseFloat(formData.salePrice) : 0,
            saleStartDate: formData.saleStartDate,
            saleEndDate: formData.saleEndDate
        };

        try {
            if (currentProduct) {
                // Update existing product
                const response = await fetch(`/api/products/${currentProduct.id || currentProduct._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    const updatedProduct = await response.json();
                    // Ensure id/id compatibility
                    const normalizedProduct = { ...updatedProduct, id: updatedProduct._id };
                    setProducts(prev => prev.map(p => (p.id === currentProduct.id || p._id === currentProduct._id) ? normalizedProduct : p));
                }
            } else {
                // Create new product
                const response = await fetch('/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    const newProduct = await response.json();
                    // Ensure id/_id compatibility
                    const normalizedProduct = { ...newProduct, id: newProduct._id };
                    setProducts(prev => [...prev, normalizedProduct]);
                }
            }

            setIsEditing(false);
            setCurrentProduct(null);
            setFormData({
                name: '',
                price: '',
                stock: '',
                category: 'Men',
                description: '',
                images: [],
                salePrice: '',
                saleStartDate: '',
                saleEndDate: ''
            });

        } catch (error) {
            console.error('Failed to save product:', error);
            alert('Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                if (response.ok) {
                    setProducts(prev => prev.filter(p => p.id !== id && p._id !== id));
                }
            } catch (error) {
                console.error('Failed to delete product:', error);
                alert('Failed to delete product');
            }
        }
    };

    const addImage = (url) => {
        if (url) {
            setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold dark:text-white">Products</h2>
                <button
                    onClick={() => {
                        setIsEditing(true);
                        setCurrentProduct(null);
                        setFormData({
                            name: '',
                            price: '',
                            stock: '',
                            category: 'Men',
                            description: '',
                            images: [],
                            salePrice: '',
                            saleStartDate: '',
                            saleEndDate: ''
                        });
                    }}
                    className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    <FaPlus /> Add Product
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">{currentProduct ? 'Edit Product' : 'Add Product'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Product Images</label>
                                <div className="space-y-4">
                                    {/* Image List */}
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative aspect-square border dark:border-gray-600 rounded overflow-hidden group">
                                                <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                                {index === 0 && (
                                                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">Main Image</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add New Image */}
                                    <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                        <p className="text-sm font-medium mb-2 dark:text-white">Add New Image</p>
                                        <div className="space-y-3">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    const formData = new FormData();
                                                    formData.append('image', file);

                                                    try {
                                                        // Show loading state or similar if needed
                                                        e.target.disabled = true;
                                                        const res = await fetch('/api/upload', {
                                                            method: 'POST',
                                                            headers: {
                                                                Authorization: `Bearer ${user.token}`,
                                                            },
                                                            body: formData,
                                                        });

                                                        if (!res.ok) {
                                                            const error = await res.json();
                                                            throw new Error(error.message || 'Image upload failed');
                                                        }

                                                        const data = await res.json();
                                                        addImage(data.url);
                                                        e.target.value = ''; // Reset input
                                                    } catch (error) {
                                                        console.error('Upload error:', error);
                                                        alert('Failed to upload image: ' + error.message);
                                                    } finally {
                                                        e.target.disabled = false;
                                                    }
                                                }}
                                                className="w-full text-sm dark:text-gray-300"
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Or enter image URL"
                                                    className="flex-1 border p-2 rounded text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addImage(e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    id="urlInput"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const input = document.getElementById('urlInput');
                                                        addImage(input.value);
                                                        input.value = '';
                                                    }}
                                                    className="bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Stock</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="new">New Arrivals</option>
                                    <option value="archive">Archive</option>
                                </select>
                            </div>

                            <div className="border-t pt-4 mt-4 dark:border-gray-700">
                                <h4 className="font-bold mb-2 dark:text-white">Sale Options</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-200">Sale Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.salePrice}
                                            onChange={e => setFormData({ ...formData, salePrice: e.target.value })}
                                            className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Optional"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Start Date</label>
                                            <input
                                                type="date"
                                                value={formData.saleStartDate}
                                                onChange={e => setFormData({ ...formData, saleStartDate: e.target.value })}
                                                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 dark:text-gray-200">End Date</label>
                                            <input
                                                type="date"
                                                value={formData.saleEndDate}
                                                onChange={e => setFormData({ ...formData, saleEndDate: e.target.value })}
                                                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors border border-gray-100 dark:border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="p-4 dark:text-gray-300">Product</th>
                            <th className="p-4 dark:text-gray-300">Price</th>
                            <th className="p-4 dark:text-gray-300">Stock</th>
                            <th className="p-4 dark:text-gray-300">Category</th>
                            <th className="p-4 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {products.map((product) => (
                            <tr key={product.id || product._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-10 h-10 rounded object-cover"
                                    />
                                    <span className="font-medium dark:text-white">{product.name}</span>
                                </td>
                                <td className="p-4 dark:text-gray-300">
                                    {product.salePrice ? (
                                        <div>
                                            <span className="text-red-600 font-bold">${product.salePrice}</span>
                                            <span className="text-gray-400 line-through text-sm ml-2">${product.price}</span>
                                        </div>
                                    ) : (
                                        `$${product.price}`
                                    )}
                                </td>
                                <td className="p-4 dark:text-gray-300">{product.countInStock || product.stock}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-3 text-gray-500 dark:text-gray-400">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id || product._id)}
                                        className="hover:text-red-600 dark:hover:text-red-400"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
