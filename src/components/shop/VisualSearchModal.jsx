import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCamera, FaUpload, FaSpinner, FaCheckCircle, FaBolt } from 'react-icons/fa';
import { useShop } from '../../context/ShopContext';
import { Link } from 'react-router-dom';

/**
 * 🚀 VISUAL SEARCH MODAL
 * Ultra-fast with streaming progress and premium UI
 */
const VisualSearchModal = ({ isOpen, onClose }) => {
    const { products } = useShop();
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [detectedType, setDetectedType] = useState(null);
    const [detectedColors, setDetectedColors] = useState([]);
    const [confidence, setConfidence] = useState(0);
    const [processingTime, setProcessingTime] = useState(0);
    const [processingStep, setProcessingStep] = useState('');
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            resetSearch();
        }
    }, [isOpen]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setSearchResults([]);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);

        try {
            // Step 1: Send to AI
            setProcessingStep('analyzing');
            const formData = new FormData();
            formData.append('image', file);

            const startTime = Date.now();
            const response = await fetch('/api/upload/visual-search', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error (${response.status})`);
            }

            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Search failed');

            const apiTime = Date.now() - startTime;
            setProcessingTime(data.processingTime || apiTime);

            // Step 2: Update detected attributes
            setProcessingStep('matching');
            setDetectedType(data.prediction.label);
            setConfidence(Math.round((data.prediction.confidence || data.prediction.score) * 100));
            setDetectedColors(data.colors || []);

            // Step 3: Find matching products
            const matchedProducts = findMatchingProducts(
                products,
                data.prediction.label,
                data.colors || []
            );

            setSearchResults(matchedProducts);
            setProcessingStep('done');

        } catch (err) {
            console.error('Visual search error:', err);
            setError(err.message || 'Search failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Find matching products based on detected type and colors
     */
    const findMatchingProducts = (allProducts, type, colors) => {
        if (!allProducts || allProducts.length === 0) return [];

        const typeAliases = {
            'jacket': ['jacket', 'blazer', 'coat', 'bomber', 'leather', 'outerwear', 'windbreaker', 'parka'],
            't-shirt': ['t-shirt', 'tee', 'tshirt'],
            'shirt': ['shirt', 'blouse', 'button'],
            'pants': ['pants', 'trousers', 'jeans', 'chinos'],
            'hoodie': ['hoodie', 'sweatshirt', 'pullover'],
            'sweater': ['sweater', 'cardigan', 'knit'],
            'dress': ['dress', 'gown'],
            'shoes': ['shoes', 'sneakers', 'boots'],
            'bag': ['bag', 'backpack', 'purse', 'tote']
        };

        const aliases = typeAliases[type] || [type];

        // Score each product
        const scored = allProducts.map(product => {
            let score = 0;
            const name = product.name.toLowerCase();
            const category = (product.category || '').toLowerCase();
            const productColors = product.colors || [];

            // Type matching (60 points max)
            if (aliases.some(alias => name.includes(alias))) {
                score += 60;
            } else if (name.includes(type)) {
                score += 50;
            }

            // Category matching bonus (20 points)
            if (category.includes(type) || aliases.some(alias => category.includes(alias))) {
                score += 20;
            }

            // Color matching (30 points max)
            if (colors.length > 0 && productColors.length > 0) {
                const primaryMatch = productColors.includes(colors[0]);
                if (primaryMatch) score += 20;

                const secondaryMatches = colors.slice(1).filter(c => productColors.includes(c)).length;
                score += secondaryMatches * 5;
            }

            // Rating boost (10 points max)
            if (product.rating >= 4.5) score += 10;
            else if (product.rating >= 4.0) score += 5;

            return { ...product, matchScore: Math.min(score, 100) };
        });

        // Filter and sort
        return scored
            .filter(p => p.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 12);
    };

    const handleCameraCapture = () => {
        if (fileInputRef.current) {
            fileInputRef.current.setAttribute('capture', 'environment');
            fileInputRef.current.click();
        }
    };

    const resetSearch = () => {
        setImagePreview(null);
        setSearchResults([]);
        setDetectedType(null);
        setDetectedColors([]);
        setConfidence(0);
        setProcessingStep('');
        setError(null);
    };

    // Color display helper
    const getColorStyle = (color) => {
        const colorMap = {
            'black': '#000000',
            'white': '#FFFFFF',
            'gray': '#808080',
            'red': '#DC2626',
            'blue': '#2563EB',
            'green': '#16A34A',
            'yellow': '#EAB308',
            'orange': '#EA580C',
            'purple': '#9333EA',
            'pink': '#EC4899',
            'brown': '#92400E'
        };
        return colorMap[color] || '#888888';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-zinc-800"
                    >
                        {/* Header */}
                        <div className="relative p-6 lg:p-8 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                        <FaBolt className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-black dark:text-white uppercase tracking-tight">
                                            Visual Search
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            AI-powered instant product matching
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    <FaTimes size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                            {!imagePreview ? (
                                /* Upload Area */
                                <div className="space-y-6">
                                    <div
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        className={`relative border-2 border-dashed rounded-2xl p-12 lg:p-16 text-center transition-all cursor-pointer ${dragActive
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                                            : 'border-gray-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-600'
                                            }`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileInput}
                                            className="hidden"
                                        />

                                        <div className="space-y-4">
                                            <div className="flex justify-center">
                                                <div className="p-5 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50">
                                                    <FaUpload className="text-3xl text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-bold dark:text-white mb-1">
                                                    Drop your image here
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                    or click to browse • JPG, PNG, WEBP
                                                </p>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
                                                >
                                                    <FaUpload className="inline mr-2" />
                                                    Choose File
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleCameraCapture(); }}
                                                    className="px-6 py-3 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                                >
                                                    <FaCamera className="inline mr-2" />
                                                    Take Photo
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Speed Badge */}
                                    <div className="flex justify-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                                            <FaBolt className="text-xs" />
                                            Lightning-fast AI • Results in ~2 seconds
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Results Area */
                                <div className="space-y-6">
                                    {/* Image Preview & Detected Attributes */}
                                    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 dark:bg-zinc-900 rounded-2xl">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={imagePreview}
                                                alt="Uploaded"
                                                className="w-full md:w-40 h-40 object-cover rounded-xl shadow-lg"
                                            />
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            {/* Detected Type */}
                                            {detectedType && (
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-medium">
                                                        Detected Type
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold uppercase rounded-full shadow-lg shadow-indigo-500/25">
                                                            {detectedType}
                                                        </span>
                                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                                                            {confidence}% confidence
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Detected Colors */}
                                            {detectedColors.length > 0 && (
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-medium">
                                                        Detected Colors
                                                    </p>
                                                    <div className="flex gap-2">
                                                        {detectedColors.map((color, i) => (
                                                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-full shadow-sm">
                                                                <div
                                                                    className="w-4 h-4 rounded-full border border-gray-200 dark:border-zinc-600"
                                                                    style={{ backgroundColor: getColorStyle(color) }}
                                                                />
                                                                <span className="text-sm font-medium dark:text-white capitalize">
                                                                    {color}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Processing Time */}
                                            {processingTime > 0 && !isProcessing && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <FaCheckCircle className="text-green-500" />
                                                    Processed in {(processingTime / 1000).toFixed(1)}s
                                                </div>
                                            )}

                                            <button
                                                onClick={resetSearch}
                                                className="px-5 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-black dark:text-white rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                                            >
                                                Try Another Image
                                            </button>
                                        </div>
                                    </div>

                                    {/* Error State */}
                                    {error && (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-center">
                                            {error}
                                            <button
                                                onClick={resetSearch}
                                                className="ml-3 underline hover:no-underline"
                                            >
                                                Try again
                                            </button>
                                        </div>
                                    )}

                                    {/* Processing State */}
                                    {isProcessing && (
                                        <div className="text-center py-10">
                                            <div className="flex justify-center mb-4">
                                                <div className="relative">
                                                    <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900"></div>
                                                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
                                                </div>
                                            </div>
                                            <p className="text-lg font-medium dark:text-white mb-1">
                                                {processingStep === 'analyzing' && '🔍 Analyzing with AI...'}
                                                {processingStep === 'matching' && '🎯 Finding matches...'}
                                                {!processingStep && '⚡ Processing...'}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                This usually takes 2-3 seconds
                                            </p>
                                        </div>
                                    )}

                                    {/* Results Grid */}
                                    {!isProcessing && searchResults.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-black dark:text-white mb-4 uppercase tracking-tight flex items-center gap-2">
                                                <span>Similar Products</span>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 lowercase">
                                                    ({searchResults.length} found)
                                                </span>
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {searchResults.map((product) => (
                                                    <Link
                                                        key={product._id || product.id}
                                                        to={`/product/${product._id || product.id}`}
                                                        onClick={onClose}
                                                        className="group relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-xl hover:shadow-indigo-500/10"
                                                    >
                                                        <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                loading="lazy"
                                                            />
                                                            {/* Match Score Badge */}
                                                            <div className={`absolute top-2 right-2 px-2.5 py-1 text-xs font-bold rounded-full ${product.matchScore >= 70
                                                                ? 'bg-green-500 text-white'
                                                                : product.matchScore >= 40
                                                                    ? 'bg-yellow-500 text-black'
                                                                    : 'bg-gray-500 text-white'
                                                                }`}>
                                                                {product.matchScore}% Match
                                                            </div>
                                                        </div>
                                                        <div className="p-3">
                                                            <h4 className="font-bold text-sm dark:text-white line-clamp-1">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                                                ${product.price}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* No Results */}
                                    {!isProcessing && !error && searchResults.length === 0 && detectedType && (
                                        <div className="text-center py-10">
                                            <div className="text-5xl mb-4">😔</div>
                                            <h3 className="text-xl font-bold dark:text-white mb-2">
                                                No matching products found
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                                We couldn't find any {detectedType}s matching your image
                                            </p>
                                            <button
                                                onClick={resetSearch}
                                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                                            >
                                                Try Another Image
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default VisualSearchModal;
