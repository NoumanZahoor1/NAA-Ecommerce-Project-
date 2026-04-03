import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaRedo, FaShoppingBag, FaLightbulb } from 'react-icons/fa';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

// === PREMIUM LOCAL BRAIN DATA 🧠 ===

const KNOWLEDGE_BASE = [
    { patterns: ['shipping', 'delivery', 'ship', 'track'], answer: "We offer Free Shipping 🚚 on all orders over $100! For smaller orders, standard rates apply. Delivery usually takes 3-5 business days." },
    { patterns: ['return', 'refund', 'exchange', 'policy'], answer: "No worries! You can return or exchange any item within 30 days 📅. Just keep the tags on!" },
    { patterns: ['support', 'contact', 'help', 'email', 'phone'], answer: "We're here for you! 🤝 Email us at support@naa.com or call 1-800-STYLES." },
    { patterns: ['payment', 'pay', 'card', 'credit', 'paypal', 'stripe', 'apple'], answer: "We accept all major credit cards 💳, PayPal, Stripe, and Apple Pay." },
    { patterns: ['size', 'sizing', 'fit', 'chart'], answer: "Our sizes run true to fit! 📏 Check the size guide on each product page for exact measurements." },
    { patterns: ['location', 'store', 'where'], answer: "We are an online-first store 🌐, shipping globally from our NY warehouse!" },
    { patterns: ['thank', 'thanks'], answer: "You're welcome! Happy shopping! 🛍️" },
    { patterns: ['bye', 'goodbye', 'cya'], answer: "See you later! Come back soon! 👋" },
    { patterns: ['human', 'person', 'agent'], answer: "I'm a super-smart AI 🤖, but I can pass your message to a human agent if you email support@naa.com." }
];

const SYNONYM_MAP = {
    'cheap': ['t-shirt', 'tank', 'socks', 'beanie', 'cap'],
    'budget': ['t-shirt', 'tank', 'socks', 'beanie', 'cap'],
    'affordable': ['t-shirt', 'tank', 'socks', 'beanie', 'cap'],
    'expensive': ['leather', 'jacket', 'watch', 'coat', 'blazer'],
    'premium': ['leather', 'jacket', 'watch', 'coat', 'blazer'],
    'fancy': ['blazer', 'dress', 'watch', 'suit'],
    'formal': ['blazer', 'shirt', 'dress', 'watch'],
    'casual': ['hoodie', 'sweat', 'jeans', 't-shirt', 'sneaker'],
    'sport': ['gym', 'run', 'active', 'sneaker', 'shoe'],
    'gym': ['active', 'sport', 'run', 'shoe', 'sneaker', 'bag'],
    'summer': ['dress', 'shorts', 'shirt', 't-shirt', 'tank'],
    'winter': ['jacket', 'coat', 'hoodie', 'sweater', 'sweatshirt', 'beanie', 'scarf'],
    'date': ['dress', 'shirt', 'jeans', 'blazer', 'jacket'],
    'wedding': ['dress', 'blazer', 'formal', 'elegant', 'suit'],
    'trending': ['jacket', 'leather', 'hoodie', 'watch'],
    'new': ['jacket', 'dress', 'watch']
};

const STOP_WORDS = ['i', 'am', 'going', 'for', 'a', 'the', 'to', 'in', 'at', 'of', 'me', 'show', 'some', 'any', 'like', 'want', 'need', 'looking', 'get', 'Find', 'products', 'product', 'items', 'item'];

const ChatWidget = () => {
    const context = useShop();
    const products = context?.products || [];
    const { user } = useAuth() || {};
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: `Hi${user ? ` ${user.name}` : ''}! 👋 I'm your AI Shopping Assistant.\nPowered by GPT-4 🧠\n\nI can help you find products, give style advice, or answer questions about our store.`,
            timestamp: new Date()
        }
    ]);
    const [suggestedQuestions] = useState([
        "Show me trending products",
        "I need a casual outfit",
        "Do you have leather jackets?",
        "What are your shipping policies?"
    ]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const addMessage = (text, type = 'bot', products = null) => {
        setMessages(prev => [...prev, {
            type,
            text: text || "I'm here to help!",
            products: Array.isArray(products) ? products : null,
            timestamp: new Date()
        }]);
    };

    const searchProducts = (query) => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        let searchTerms = [];

        Object.keys(SYNONYM_MAP).forEach(key => {
            if (lowerQuery.includes(key)) {
                searchTerms = [...searchTerms, ...SYNONYM_MAP[key]];
            }
        });

        const explicitTerms = lowerQuery
            .split(/[\s,?.!]+/)
            .filter(term => term.length > 2 && !STOP_WORDS.includes(term));

        searchTerms = [...new Set([...searchTerms, ...explicitTerms])];
        if (searchTerms.length === 0) return [];

        return (products || []).filter(p => {
            if (!p) return false;
            const productText = `${p.name || ''} ${p.category || ''} ${p.description || ''} ${Array.isArray(p.colors) ? p.colors.join(' ') : ''}`.toLowerCase();
            return searchTerms.some(term => productText.includes(term));
        }).slice(0, 5);
    };

    const getBestSellers = () => {
        return (products || []).filter(p => p && ['Leather Jacket', 'Summer Dress', 'Running Shoes', 'Oversized Hoodie'].includes(p.name)).slice(0, 4);
    };

    const getAIResponse = async (userMessage) => {
        if (!userMessage) return;
        setIsTyping(true);

        try {
            const contextMessages = messages.slice(-4).map(m => ({
                role: m.type === 'user' ? 'user' : 'assistant',
                content: m.text || ''
            }));
            contextMessages.push({ role: 'user', content: userMessage });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: contextMessages }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();

            // Priority: Backend Products > Frontend Matching
            if (data && data.reply) {
                // If backend provides products (from enhanced DB search), use them
                if (data.products && data.products.length > 0) {
                    addMessage(data.reply, 'bot', data.products);
                }
                // Fallback to simpler string matching for "Mock AI" (Legacy support)
                else {
                    const mentioned = (products || []).filter(p => p && data.reply.toLowerCase().includes((p.name || '').toLowerCase())).slice(0, 4);
                    addMessage(data.reply, 'bot', mentioned.length > 0 ? mentioned : null);
                }
                setIsTyping(false);
                return;
            }
            throw new Error("No AI reply");

        } catch (error) {
            console.log("🧩 Local Brain engaged:", error.message);

            try {
                const lowerMsg = userMessage.toLowerCase();

                // 1. Search Products FIRST (Higher intent)
                let matched = searchProducts(userMessage);

                if (matched && matched.length > 0) {
                    const greetings = ["I found these styles for you! ✨", "Check these out! 👀", "Here are some recommendations:"];
                    addMessage(greetings[Math.floor(Math.random() * greetings.length)], 'bot', matched);
                } else {
                    // 2. Then check Knowledge Base (Support/FAQ)
                    // Substring match is safe because Search Priority handles "fit/outfit"
                    const kbMatch = KNOWLEDGE_BASE.find(kb =>
                        kb.patterns.some(p => lowerMsg.includes(p))
                    );

                    if (kbMatch) {
                        addMessage(kbMatch.answer, 'bot');
                    } else {
                        // 3. Zero Dead Ends - Final Fallback
                        addMessage("I couldn't find an exact match, but you might love our top trending items! 🔥", 'bot', getBestSellers());
                    }
                }
            } catch (fallbackError) {
                console.error("🔥 Critical Fallback Error:", fallbackError);
                addMessage("I'm here to help! Feel free to browse our products or ask about shipping and returns.", 'bot', getBestSellers());
            }
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const msg = inputValue.trim();
        addMessage(msg, 'user');
        setInputValue('');
        getAIResponse(msg);
    };

    const handleSuggestedQuestion = (q) => {
        addMessage(q, 'user');
        getAIResponse(q);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const resetChat = () => {
        setMessages([{
            type: 'bot',
            text: `Hi${user ? ` ${user.name}` : ''}! 👋 I'm your AI Shopping Assistant.\nPowered by GPT-4 🧠\n\nI can help you find products, give style advice, or answer questions about our store.`,
            timestamp: new Date()
        }]);
        setInputValue('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="bg-white dark:bg-gray-900 w-96 h-[600px] rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 animate-fade-in-up">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <FaRobot className="text-2xl" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                            </div>
                            <div>
                                <span className="font-bold block">AI Assistant</span>
                                <span className="text-xs text-indigo-100">Powered by GPT-4</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={resetChat} className="hover:text-indigo-200 transition-colors" title="New Chat">
                                <FaRedo size={14} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="hover:text-indigo-200 transition-colors">
                                <FaTimes size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-950 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index}>
                                <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                                        <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${msg.type === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none shadow-lg'
                                            : 'bg-white dark:bg-gray-800 dark:text-gray-200 shadow-md border border-gray-100 dark:border-gray-700 rounded-bl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>

                                {msg.products && msg.products.length > 0 && (
                                    <div className="mt-3 space-y-2 ml-2">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recommended Items</p>
                                        {msg.products.map(product => (
                                            <Link
                                                key={product.id}
                                                to={`/product/${product.id}`}
                                                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all duration-300 group"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{product.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                                                    <p className="text-sm font-bold text-green-600 dark:text-green-500 mt-1">${product.price}</p>
                                                </div>
                                                <FaShoppingBag className="text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none shadow-md border border-gray-100 dark:border-gray-700">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isTyping && messages.length > 0 && messages[messages.length - 1].type === 'bot' && (
                            <div className="pt-2 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <FaLightbulb className="text-yellow-500" />
                                    <span>Try asking:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedQuestions.map((question, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSuggestedQuestion(question)}
                                            className="text-xs px-3 py-2 bg-indigo-50 dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 rounded-full hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 border border-indigo-100 dark:border-gray-700"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about style, products, or support..."
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="px-5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-indigo-500/30"
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 flex items-center justify-center group z-50"
            >
                {isOpen ? <FaTimes size={20} /> : (
                    <>
                        <FaRobot size={24} className="group-hover:rotate-12 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                    </>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
