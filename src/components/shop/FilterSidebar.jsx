import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';


const FilterSection = ({ title, children, isOpen = true }) => {
    const [open, setOpen] = useState(isOpen);
    return (
        <div className="border-b border-gray-200 dark:border-gray-800 py-6 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="flex justify-between items-center w-full mb-4 group"
            >
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-gray-100 group-hover:text-gray-600 transition-colors">
                    {title}
                </h3>
                {open ? <FaAngleUp className="text-xs" /> : <FaAngleDown className="text-xs" />}
            </button>
            <motion.div
                initial={false}
                animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
            >
                {children}
            </motion.div>
        </div>
    );
};

const FilterSidebar = ({ filters, setFilters }) => {
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const colors = ['black', 'white', 'blue', 'red', 'gray', 'beige', 'olive', 'navy'];
    const categories = ['Men', 'Women', 'Accessories', 'New Arrivals', 'Sale'];


    const handleFilterChange = (type, value) => {
        setFilters(prev => {
            const current = prev[type] || [];
            if (current.includes(value)) {
                return { ...prev, [type]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [type]: [...current, value] };
            }
        });
    };

    return (
        <div className="w-64 flex-shrink-0 pr-8 bg-white dark:bg-black">
            <div className="sticky top-24">
                <div className="mb-6">
                    <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Filters</h2>
                    <button
                        onClick={() => setFilters({ category: [], size: [], color: [], maxPrice: 1000 })}
                        className="text-xs text-gray-500 underline mt-2 hover:text-black dark:hover:text-white"
                    >
                        Clear All
                    </button>
                </div>

                <FilterSection title="Category">
                    <div className="space-y-3">
                        {categories.map(cat => (
                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.category?.includes(cat === 'New Arrivals' ? 'new' : cat === 'Sale' ? 'Sale' : cat)}
                                        onChange={() => handleFilterChange('category', cat === 'New Arrivals' ? 'new' : cat === 'Sale' ? 'Sale' : cat)}
                                        className="peer h-4 w-4 appearance-none border border-gray-300 rounded-none checked:bg-black checked:border-black transition-all"
                                    />
                                    <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className={`text-sm tracking-wide transition-colors ${filters.category?.includes(cat === 'New Arrivals' ? 'new' : cat === 'Sale' ? 'Sale' : cat) ? 'font-medium text-black dark:text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-gray-200'}`}>
                                    {cat}
                                </span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Size">
                    <div className="grid grid-cols-4 gap-2">
                        {sizes.map(size => (
                            <button
                                key={size}
                                onClick={() => handleFilterChange('size', size)}
                                className={`h-10 w-full border text-xs font-medium transition-all duration-200 
                                    ${filters.size?.includes(size)
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900 dark:bg-transparent dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-500'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Color">
                    <div className="flex flex-wrap gap-3">
                        {colors.map(color => (
                            <button
                                key={color}
                                onClick={() => handleFilterChange('color', color)}
                                className={`w-8 h-8 rounded-full border transition-all duration-200 relative
                                    ${filters.color?.includes(color) ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-gray-100 scale-110' : 'border-gray-200 hover:scale-110'}
                                `}
                                style={{ backgroundColor: color !== 'white' ? color : '#fff' }}
                                title={color}
                            >
                                {color === 'white' && <span className="sr-only">White</span>}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Price Range">
                    <div className="px-1">
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={filters.maxPrice || 1000}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                        />
                        <div className="flex justify-between text-xs font-medium text-gray-900 dark:text-gray-100 mt-4">
                            <span>$0</span>
                            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">${filters.maxPrice || 1000}</span>
                        </div>
                    </div>
                </FilterSection>


            </div>
        </div>
    );
};

export default FilterSidebar;
