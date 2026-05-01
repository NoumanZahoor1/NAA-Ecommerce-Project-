import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaArrowsAltV, FaWeightHanging, FaCamera, FaUpload, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import {
    loadMeasurementProfile,
    saveMeasurementProfile,
    calculateFitPrediction,
    getCrossBrandSize,
    brandFitNotes
} from '../../utils/fitPrediction';

const SizeLab = ({ isOpen, onClose, productFit = 'Regular', availableSizes = [], onSelectSize, product }) => {
    const [activeTab, setActiveTab] = useState('manual'); // 'manual', 'photo', 'history'
    const [height, setHeight] = useState(175); // cm
    const [weight, setWeight] = useState(70);  // kg

    const [uploadedPhoto, setUploadedPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
    const [showBrandComparison, setShowBrandComparison] = useState(false);
    const fileInputRef = useRef(null);

    // Load saved profile on mount
    useEffect(() => {
        if (isOpen) {
            const savedProfile = loadMeasurementProfile();
            if (savedProfile) {
                setHeight(savedProfile.height);
                setWeight(savedProfile.weight);
            }
        }
    }, [isOpen]);

    const bmi = useMemo(() => {
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }, [height, weight]);

    // Size Mapping Logic
    const recommendedSize = useMemo(() => {
        if (!availableSizes || availableSizes.length === 0) return null;

        let h = 4;
        if (height <= 160) h = 1;
        else if (height <= 170) h = 2;
        else if (height <= 180) h = 3;

        let w = 4;
        if (weight <= 55) w = 1;
        else if (weight <= 65) w = 2;
        else if (weight <= 80) w = 3;

        const finalSize = Math.max(h, w);
        const standardSizes = {
            1: 'XS',
            2: 'S',
            3: 'M',
            4: 'L',
            5: 'XL'
        };

        const recommendedLabel = standardSizes[finalSize];
        return availableSizes.find(s => s === recommendedLabel) || recommendedLabel;
    }, [height, weight, availableSizes]);

    // Fit prediction
    const fitPrediction = useMemo(() => {
        if (!product || !product.category) return null;
        const userProfile = { height, weight };
        try {
            return calculateFitPrediction(userProfile, product);
        } catch (err) {
            console.error("Error calculating fit prediction", err);
            return null;
        }
    }, [height, weight, product]);

    // Morphing logic based on BMI
    const silhouetteScale = useMemo(() => {
        let scaleX = 1;
        let scaleY = 1;

        const bmiFactor = (bmi - 22) / 10;
        scaleX += bmiFactor * 0.5;

        const heightFactor = (height - 175) / 50;
        scaleY += heightFactor;

        return { x: scaleX, y: scaleY };
    }, [bmi, height]);

    const fitRecommendation = useMemo(() => {
        if (bmi < 18.5) return `Lean build detected. Size ${recommendedSize} will provide a sleek, editorial drape.`;
        if (bmi < 25) return `Balanced proportions. Size ${recommendedSize} is your optimal anatomic match.`;
        if (bmi < 30) return `Broad frame detected. We recommend Size ${recommendedSize} for comfortable movement.`;
        return `Powerful build. Size ${recommendedSize} ensures the intended ${productFit} silhouette.`;
    }, [bmi, productFit, recommendedSize]);

    const handlePhotoUpload = async (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setIsProcessingPhoto(true);
        setUploadedPhoto(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Simulate AI processing (in production, this would call an AI service)
        setTimeout(() => {
            // Simulated measurements from photo
            const estimatedHeight = height + (Math.random() * 10 - 5);
            const estimatedWeight = weight + (Math.random() * 5 - 2.5);

            setHeight(Math.round(estimatedHeight));
            setWeight(Math.round(estimatedWeight));
            setIsProcessingPhoto(false);
        }, 2000);
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handlePhotoUpload(e.target.files[0]);
        }
    };

    const handleSaveProfile = () => {
        const profile = {
            height,
            weight,
            method: activeTab === 'photo' ? 'photo' : 'manual',
            confidence: activeTab === 'photo' ? 85 : 100
        };
        saveMeasurementProfile(profile);
    };

    const handleApplySize = () => {
        handleSaveProfile();
        onSelectSize(recommendedSize);
        onClose();
    };

    // Get cross-brand sizes
    const crossBrandSizes = useMemo(() => {
        if (!product || !product.category || !recommendedSize) return null;
        const category = product.category;
        const gender = category === 'Men' ? 'Men' : 'Women';
        try {
            return getCrossBrandSize(recommendedSize, product.name, gender);
        } catch (err) {
            console.error("Error getting cross brand size", err);
            return null;
        }
    }, [recommendedSize, product]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6">
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
                        className="relative w-full max-w-6xl max-h-[92vh] bg-white dark:bg-black rounded-[2rem] lg:rounded-[3rem] overflow-hidden flex flex-col shadow-2xl border dark:border-zinc-900"
                    >
                        {/* Header */}
                        <div className="relative p-6 lg:p-8 border-b border-gray-100 dark:border-gray-900">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl lg:text-4xl font-black dark:text-white uppercase tracking-tighter mb-2">
                                        AI Size Lab
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                        Advanced fit prediction powered by AI
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 rounded-full bg-gray-50 dark:bg-zinc-900 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2 mt-6">
                                {[
                                    { id: 'manual', label: 'Manual Input', icon: FaArrowsAltV },
                                    { id: 'photo', label: 'Photo Analysis', icon: FaCamera },
                                    { id: 'brands', label: 'Brand Comparison', icon: FaInfoCircle }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === tab.id
                                            ? 'bg-black dark:bg-white text-white dark:text-black'
                                            : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <tab.icon size={14} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-full">
                                {/* Left: Visualizer */}
                                <div className="relative bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-zinc-900">
                                    <div className="absolute top-6 left-6 lg:top-10 lg:left-10 z-10">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Visualization Engine</span>
                                        <h3 className="text-xl lg:text-2xl font-black dark:text-white uppercase italic">Anatomic Scan</h3>
                                    </div>

                                    {/* Silhouette Visualization */}
                                    <motion.div
                                        animate={{
                                            scaleX: silhouetteScale.x,
                                            scaleY: silhouetteScale.y,
                                        }}
                                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                                        className="relative w-32 h-64 lg:w-48 lg:h-80 flex items-center justify-center"
                                    >
                                        <svg viewBox="0 0 100 200" className="w-full h-full fill-gray-900 dark:fill-white opacity-20 dark:opacity-10">
                                            <path d="M50,10 C55,10 60,15 60,20 C60,25 55,30 50,30 C45,30 40,25 40,20 C40,15 45,10 50,10 M50,30 L50,50 M50,50 L30,60 M50,50 L70,60 M50,50 L50,120 M50,120 L40,190 M50,120 L60,190" stroke="currentColor" fill="none" strokeWidth="2" />
                                            <ellipse cx="50" cy="20" rx="10" ry="10" />
                                            <path d="M50,30 Q65,30 70,60 L75,100 Q75,110 65,110 L60,110 L60,190 Q60,195 55,195 L45,195 Q40,195 40,190 L40,110 L35,110 Q25,110 25,100 L30,60 Q35,30 50,30 Z" />
                                        </svg>

                                        <motion.div
                                            className="absolute inset-0 border-2 border-indigo-600/30 rounded-full"
                                            animate={{
                                                padding: productFit === 'Slim' ? '20px' : productFit === 'Oversized' ? '0px' : '10px'
                                            }}
                                        />
                                    </motion.div>

                                    <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 flex justify-between items-end">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block mb-1">Index Correlation</span>
                                            <div className="text-3xl lg:text-5xl font-black dark:text-white tracking-tighter italic">
                                                {bmi} <span className="text-[10px] uppercase not-italic tracking-normal">BMI</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Design Intent</span>
                                            <div className="text-lg lg:text-xl font-black dark:text-white uppercase tracking-tighter italic">{productFit} Fit</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Controls */}
                                <div className="relative p-6 lg:p-8 xl:p-10 flex flex-col justify-center bg-white dark:bg-black">
                                    {activeTab === 'manual' && (
                                        <div className="space-y-6 lg:space-y-8">
                                            <div>
                                                <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-2">Your Measurements</h3>
                                                <p className="text-gray-400 text-sm">Adjust sliders for accurate size recommendation</p>
                                            </div>

                                            {/* Height Slider */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                                                        <FaArrowsAltV className="opacity-50" size={12} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Height</span>
                                                    </div>
                                                    <span className="text-xl lg:text-2xl font-black dark:text-white italic">
                                                        {height} <span className="text-xs not-italic opacity-30">cm</span>
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="150"
                                                    max="210"
                                                    value={height}
                                                    onChange={(e) => setHeight(parseInt(e.target.value))}
                                                    className="w-full h-1 bg-gray-100 dark:bg-gray-900 appearance-none rounded-full accent-indigo-600 cursor-pointer"
                                                />
                                            </div>

                                            {/* Weight Slider */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                                                        <FaWeightHanging className="opacity-50" size={12} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Weight</span>
                                                    </div>
                                                    <span className="text-xl lg:text-2xl font-black dark:text-white italic">
                                                        {weight} <span className="text-xs not-italic opacity-30">kg</span>
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="45"
                                                    max="120"
                                                    value={weight}
                                                    onChange={(e) => setWeight(parseInt(e.target.value))}
                                                    className="w-full h-1 bg-gray-100 dark:bg-gray-900 appearance-none rounded-full accent-indigo-600 cursor-pointer"
                                                />
                                            </div>

                                            {/* Fit Prediction Card */}
                                            {fitPrediction && (
                                                <div className="pt-6 border-t border-gray-100 dark:border-gray-900">
                                                    <div className={`p-6 rounded-2xl border ${fitPrediction.confidence > 85
                                                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                                                        : fitPrediction.confidence > 75
                                                            ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900'
                                                            : 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900'
                                                        }`}>
                                                        <div className="flex items-start gap-3 mb-3">
                                                            {fitPrediction.confidence > 85 ? (
                                                                <FaCheckCircle className="text-green-600 dark:text-green-400 mt-0.5" size={18} />
                                                            ) : fitPrediction.confidence > 75 ? (
                                                                <FaInfoCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5" size={18} />
                                                            ) : (
                                                                <FaExclamationTriangle className="text-orange-600 dark:text-orange-400 mt-0.5" size={18} />
                                                            )}
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
                                                                        Fit Confidence
                                                                    </span>
                                                                    <span className="text-lg font-black dark:text-white">
                                                                        {fitPrediction.confidence}%
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm font-medium dark:text-white leading-relaxed">
                                                                    {fitPrediction.fitAdvice}
                                                                </p>
                                                                <div className="mt-3 flex items-center gap-2 text-xs">
                                                                    <span className="text-gray-500 dark:text-gray-400">Return Probability:</span>
                                                                    <span className={`font-bold ${fitPrediction.returnProbability < 20
                                                                        ? 'text-green-600 dark:text-green-400'
                                                                        : 'text-orange-600 dark:text-orange-400'
                                                                        }`}>
                                                                        {fitPrediction.returnProbability}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Recommendation */}
                                            <div className="pt-6 border-t border-gray-100 dark:border-gray-900">
                                                <div className="bg-indigo-600/5 dark:bg-indigo-600/10 p-6 rounded-2xl border border-indigo-600/10">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block mb-3">The Verdict</span>
                                                    <p className="text-sm font-bold dark:text-white leading-relaxed">{fitRecommendation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'photo' && (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-2">Photo Analysis</h3>
                                                <p className="text-gray-400 text-sm">Upload a full-body photo for AI measurement extraction</p>
                                            </div>

                                            {!photoPreview ? (
                                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center">
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileInput}
                                                        className="hidden"
                                                    />
                                                    <div className="space-y-4">
                                                        <div className="flex justify-center">
                                                            <div className="p-6 rounded-full bg-gray-100 dark:bg-gray-900">
                                                                <FaCamera className="text-3xl text-gray-400" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold dark:text-white mb-2">Upload Full-Body Photo</h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                                Stand straight, arms at sides, facing camera
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                                                        >
                                                            <FaUpload className="inline mr-2" />
                                                            Choose Photo
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="relative">
                                                        <img src={photoPreview} alt="Uploaded" className="w-full h-64 object-cover rounded-xl" />
                                                        {isProcessingPhoto && (
                                                            <div className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center">
                                                                <div className="text-center text-white">
                                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                                                    <p className="font-bold">Analyzing measurements...</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {!isProcessingPhoto && (
                                                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <FaCheckCircle className="text-green-600" />
                                                                <span className="font-bold text-sm dark:text-white">Measurements Extracted</span>
                                                            </div>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                Height: {height}cm • Weight: ~{weight}kg (estimated)
                                                            </p>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setPhotoPreview(null);
                                                            setUploadedPhoto(null);
                                                        }}
                                                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 text-black dark:text-white rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                                                    >
                                                        Try Another Photo
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'brands' && crossBrandSizes && (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-2">Brand Size Comparison</h3>
                                                <p className="text-gray-400 text-sm">Your NAA size {recommendedSize} in other brands</p>
                                            </div>

                                            <div className="space-y-3">
                                                {Object.entries(crossBrandSizes.brands).map(([brand, size]) => (
                                                    <div key={brand} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                                        <div>
                                                            <span className="font-bold dark:text-white">{brand}</span>
                                                            {brandFitNotes[brand] && (
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                    {brandFitNotes[brand]}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className="text-xl font-black dark:text-white">{size}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl p-4">
                                                <div className="flex items-start gap-2">
                                                    <FaInfoCircle className="text-blue-600 mt-0.5" size={16} />
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        Size conversions are approximate. Always check brand-specific size charts for best fit.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Apply Button */}
                                    <button
                                        onClick={handleApplySize}
                                        className="w-full bg-black dark:bg-white text-white dark:text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:opacity-90 transition-all mt-6"
                                    >
                                        Apply {recommendedSize} Choice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SizeLab;
