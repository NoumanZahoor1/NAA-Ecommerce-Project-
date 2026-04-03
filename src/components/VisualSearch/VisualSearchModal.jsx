import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCamera, FaUpload, FaSpinner, FaCheckCircle, FaBolt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/**
 * 🚀 VISUAL SEARCH MODAL
 * Premium UI with ultra-accurate AI analysis powered by Claude 3.5
 */
const VisualSearchModal = ({ isOpen, onClose }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [processingTime, setProcessingTime] = useState(0);
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
            setError('Please upload a valid image file (JPG, PNG, WEBP)');
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
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/visual-search', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!data.success) {
                const errorMessage = data.message + (data.error ? `: ${data.error}` : '');
                throw new Error(errorMessage || 'AI analysis failed');
            }

            setAnalysis(data.analysis);
            setSearchResults(data.matchedProducts || []);
            setProcessingTime(data.processingTime);

        } catch (err) {
            console.error('Visual search error:', err);
            setError(err.message || 'Something went wrong. Please check your connection or API key.');
        } finally {
            setIsProcessing(false);
        }
    };

    const resetSearch = () => {
        setImagePreview(null);
        setSearchResults([]);
        setAnalysis(null);
        setProcessingTime(0);
        setError(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-zinc-800"
                    >
                        {/* Header */}
                        <div className="p-6 lg:p-8 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20">
                                    <FaBolt className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter text-indigo-600">
                                        Visual Search
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                        Powered by Claude 3.5 Sonnet Vision
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-black dark:hover:text-white transition-all hover:rotate-90"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                            {!imagePreview ? (
                                /* Upload Zone */
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative border-2 border-dashed rounded-3xl p-16 lg:p-24 text-center transition-all cursor-pointer group ${dragActive
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 scale-[1.02]'
                                        : 'border-gray-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-gray-50/50 dark:hover:bg-zinc-900/50'
                                        }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileInput}
                                        className="hidden"
                                    />

                                    <div className="space-y-6">
                                        <div className="flex justify-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                                                <div className="relative p-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 group-hover:scale-110 transition-transform duration-500">
                                                    <FaUpload className="text-5xl text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-bold dark:text-white mb-2">
                                                Snap or Drop to Search
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                                Upload any clothing or accessory image to find the perfect match in our collection.
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                            <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-sm hover:scale-105 transition-transform shadow-xl">
                                                Select from Device
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); /* Add camera logic if needed */ }}
                                                className="px-8 py-4 bg-white dark:bg-zinc-800 text-black dark:text-white border border-gray-200 dark:border-zinc-700 rounded-2xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-lg"
                                            >
                                                <FaCamera className="inline mr-2" /> Use Camera
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Progress & Results Area */
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                        {/* Preview Sidebar */}
                                        <div className="lg:col-span-4 space-y-6">
                                            <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800">
                                                <img
                                                    src={imagePreview}
                                                    alt="Search Target"
                                                    className="w-full aspect-square object-cover"
                                                />
                                                {isProcessing && (
                                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                                        <FaSpinner className="text-4xl text-white animate-spin" />
                                                    </div>
                                                )}
                                            </div>

                                            {analysis && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="p-6 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 space-y-4"
                                                >
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1 block">AI Identity</span>
                                                        <h4 className="text-xl font-bold dark:text-white capitalize">{analysis.category}</h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {analysis.colors.map((color, i) => (
                                                            <span key={i} className="px-3 py-1 bg-white dark:bg-zinc-800 rounded-full text-xs font-bold dark:text-gray-300 border border-gray-200 dark:border-zinc-700 shadow-sm capitalize">
                                                                {color}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="pt-2">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Style DNA</span>
                                                        <p className="text-sm dark:text-gray-300 font-medium">{analysis.style}</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            <button
                                                onClick={resetSearch}
                                                className="w-full py-4 rounded-2xl border border-gray-200 dark:border-zinc-800 text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 font-bold transition-all"
                                            >
                                                Reset Search
                                            </button>
                                        </div>

                                        {/* Results Grid */}
                                        <div className="lg:col-span-8">
                                            {isProcessing ? (
                                                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                                                    <div className="w-16 h-16 border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin"></div>
                                                    <h3 className="text-2xl font-bold dark:text-white">AI is analyzing your style...</h3>
                                                    <p className="text-gray-500">Searching across thousands of products for the perfect match.</p>
                                                </div>
                                            ) : error ? (
                                                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                                                    <div className="text-6xl">⚠️</div>
                                                    <h3 className="text-2xl font-bold text-red-600">Something went wrong</h3>
                                                    <p className="text-gray-500 max-w-md">{error}</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">
                                                            Similar Items Found <span className="text-gray-400">({searchResults.length})</span>
                                                        </h3>
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold">
                                                            <FaCheckCircle /> Processed in {(processingTime / 1000).toFixed(1)}s
                                                        </div>
                                                    </div>

                                                    {searchResults.length > 0 ? (
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                            {searchResults.map((product) => (
                                                                <Link
                                                                    key={product._id}
                                                                    to={`/product/${product._id}`}
                                                                    onClick={onClose}
                                                                    className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 hover:border-indigo-500 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
                                                                >
                                                                    <div className="aspect-[3/4] overflow-hidden relative">
                                                                        <img
                                                                            src={product.image}
                                                                            alt={product.name}
                                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                                        />
                                                                        <div className="absolute top-3 right-3 px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full shadow-lg">
                                                                            {product.matchScore}% MATCH
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-4">
                                                                        <h4 className="font-bold text-sm dark:text-white line-clamp-1 mb-1">{product.name}</h4>
                                                                        <p className="text-indigo-600 font-black">${product.price}</p>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="py-20 text-center bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
                                                            <div className="text-6xl mb-4">🔍</div>
                                                            <h3 className="text-xl font-bold dark:text-white">No perfect matches found</h3>
                                                            <p className="text-gray-500">Try uploading a clearer image or one with better lighting.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
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
