import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaRedo, FaShoppingBag, FaLightbulb, FaMicrophone, FaCopy, FaCheck, FaCartPlus } from 'react-icons/fa';
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
    'formal': ['blazer', 'shirt', 'dress', 'watch', 'elegant'],
    'casual': ['hoodie', 'sweat', 'jeans', 't-shirt', 'sneaker'],
    'sport': ['gym', 'run', 'active', 'sneaker', 'shoe', 'athletic', 'track'],
    'gym': ['active', 'sport', 'run', 'shoe', 'sneaker', 'bag', 'athletic', 'track', 'sweat'],
    'workout': ['active', 'sport', 'run', 'shoe', 'sneaker', 'athletic', 'track', 'sweat'],
    'summer': ['dress', 'shorts', 'shirt', 't-shirt', 'tank'],
    'winter': ['jacket', 'coat', 'hoodie', 'sweater', 'sweatshirt', 'beanie', 'scarf'],
    'date': ['dress', 'shirt', 'jeans', 'blazer', 'jacket'],
    'wedding': ['blazer', 'formal', 'elegant', 'suit', 'maxi', 'gown', 'tuxedo'],
    'party': ['dress', 'shirt', 'skirt', 'jumpsuit', 'chic', 'blazer', 'party'],
    'trending': ['jacket', 'leather', 'hoodie', 'watch'],
    'new': ['jacket', 'dress', 'watch']
};

const STOP_WORDS = ['i', 'am', 'going', 'for', 'a', 'the', 'to', 'in', 'at', 'of', 'me', 'show', 'some', 'any', 'like', 'want', 'need', 'looking', 'get', 'Find', 'products', 'product', 'items', 'item'];

const ChatWidget = () => {
    const { products = [], addToCart } = useShop() || {};
    const { user } = useAuth() || {};
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isVoiceResponseExpected, setIsVoiceResponseExpected] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: `Hi${user ? ` ${user.name}` : ''}! 👋 I'm your AI Shopping Assistant.\n\nI can help you find products, give style advice, or answer questions about our store.`,
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
    }, [messages, isOpen, isTyping]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const speakResponse = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            const voices = window.speechSynthesis.getVoices();
            const premiumVoice = voices.find(v => 
                v.name.includes('Google US English') || 
                v.name.includes('Samantha') || 
                v.name.includes('Siri') ||
                v.name.includes('Premium') ||
                v.name.includes('Natural')
            );

            if (premiumVoice) {
                utterance.voice = premiumVoice;
            } else {
                utterance.lang = 'en-US';
            }

            utterance.pitch = 1.1;
            utterance.rate = 1.05;
            window.speechSynthesis.speak(utterance);
        }
    };

    const addMessage = (text, type = 'bot', products = null) => {
        const finalMessage = text || "I'm here to help!";
        
        if (type === 'bot' && isVoiceResponseExpected) {
            speakResponse(finalMessage);
            setIsVoiceResponseExpected(false);
        }

        setMessages(prev => [...prev, {
            type,
            text: finalMessage,
            products: Array.isArray(products) ? products : null,
            timestamp: new Date()
        }]);
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleAddToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (addToCart) {
            addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0] || 'Black');
        }
    };

    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Voice recognition is not supported in your browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setIsListening(false);
            setIsVoiceResponseExpected(true);
            addMessage(transcript, 'user');
            getAIResponse(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const searchProducts = (query, returnIntentOnly = false) => {
        if (!query) return { products: [], intent: false };
        const lowerQuery = query.toLowerCase();
        
        let matched = products || [];
        let isSpecialQuery = false;

        const exactMatches = matched.filter(p => {
            if (!p || !p.name) return false;
            const lowerName = p.name.toLowerCase();
            return lowerQuery.includes(lowerName) || lowerQuery.includes(lowerName + 's') || lowerQuery.includes(lowerName + 'es');
        });

        if (exactMatches.length > 0) {
            return { products: exactMatches.slice(0, 5), intent: true };
        }

        if (lowerQuery.match(/\b(men|men's|mens|male|guys?)\b/) && !lowerQuery.match(/\b(women|wo)\b/)) {
            matched = matched.filter(p => p?.category === 'Men');
            isSpecialQuery = true;
        } else if (lowerQuery.match(/\b(women|women's|womens|female|ladies|lady|girls?)\b/)) {
            matched = matched.filter(p => p?.category === 'Women');
            isSpecialQuery = true;
        } else if (lowerQuery.match(/\b(accessori(es|y)|bags?|watches?|belts?|hats?|caps?|jewelry)\b/)) {
            matched = matched.filter(p => p?.category === 'Accessories');
            isSpecialQuery = true;
        }

        if (lowerQuery.match(/\b(new|arrived|newly|arrival|latest)\b/)) {
            const newMatches = matched.filter(p => p?.category?.toLowerCase() === 'new' || p?.isNewArrival || p?.badge === 'New');
            if (newMatches.length > 0) {
                matched = newMatches;
            } else {
                matched = [...matched].reverse();
            }
            isSpecialQuery = true;
        }
        if (lowerQuery.match(/\b(sale|discount|clearance|cheap)\b/)) {
            const saleMatches = matched.filter(p => p?.category?.toLowerCase() === 'sale' || p?.isSale || p?.oldPrice || p?.price < 50);
            if (saleMatches.length > 0) {
                matched = saleMatches;
                isSpecialQuery = true;
            }
        }

        let vibeTerms = [];
        Object.keys(SYNONYM_MAP).forEach(key => {
            if (lowerQuery.match(new RegExp(`\\b${key}\\b`))) {
                vibeTerms = [...vibeTerms, ...SYNONYM_MAP[key]];
                isSpecialQuery = true;
            }
        });

        if (vibeTerms.length > 0) {
            let vibeMatches = matched.filter(p => {
                if (!p) return false;
                const productText = `${p.name || ''} ${p.category || ''} ${p.description || ''} ${p.fit || ''}`.toLowerCase();
                return vibeTerms.some(term => productText.includes(term));
            });

            // Adjustments for 'trending' queries
            if (lowerQuery.includes('trending')) {
                // 1. Exclude Gloves
                vibeMatches = vibeMatches.filter(p => p.name.toLowerCase() !== 'gloves');
                
                // 2. Prioritize Leather Jacket if it exists in the matches
                const leatherJacketIdx = vibeMatches.findIndex(p => p.name.toLowerCase() === 'leather jacket');
                if (leatherJacketIdx > -1) {
                    const [leatherJacket] = vibeMatches.splice(leatherJacketIdx, 1);
                    vibeMatches.unshift(leatherJacket);
                }
            }

            if (vibeMatches.length > 0) {
                matched = vibeMatches;
            }
        }

        if (isSpecialQuery && matched.length > 0) {
            return { products: matched.slice(0, 5), intent: true };
        }

        if (returnIntentOnly) return { products: [], intent: false };

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
        if (searchTerms.length === 0) return { products: [], intent: false };

        const fallbackMatched = (products || []).filter(p => {
            if (!p) return false;
            const productText = `${p.name || ''} ${p.category || ''} ${p.description || ''} ${Array.isArray(p.colors) ? p.colors.join(' ') : ''}`.toLowerCase();
            return searchTerms.some(term => productText.includes(term));
        }).slice(0, 5);
        
        return { products: fallbackMatched, intent: false };
    };

    const getBestSellers = () => {
        return (products || []).filter(p => p && ['Leather Jacket', 'Summer Dress', 'Running Shoes', 'Oversized Hoodie'].includes(p.name)).slice(0, 4);
    };

    const getAIResponse = async (userMessage) => {
        if (!userMessage) return;
        setIsTyping(true);

        const searchCtx = searchProducts(userMessage, true);
        if (searchCtx.intent && searchCtx.products.length > 0) {
            const greetings = ["I found exactly what you're looking for! ✨", "Check out these styles! 👀", "Here are our top picks for you:"];
            addMessage(greetings[Math.floor(Math.random() * greetings.length)], 'bot', searchCtx.products);
            setIsTyping(false);
            return;
        }

        try {
            const contextMessages = messages.slice(-4).map(m => ({
                role: m.type === 'user' ? 'user' : 'assistant',
                content: m.text || ''
            }));
            contextMessages.push({ role: 'user', content: userMessage });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: contextMessages }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();

            if (data && data.reply) {
                if (data.products && data.products.length > 0) {
                    addMessage(data.reply, 'bot', data.products);
                } else {
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
                let searchResult = searchProducts(userMessage);

                if (searchResult.products && searchResult.products.length > 0) {
                    const greetings = ["I found these styles for you! ✨", "Check these out! 👀", "Here are some recommendations:"];
                    addMessage(greetings[Math.floor(Math.random() * greetings.length)], 'bot', searchResult.products);
                } else {
                    const kbMatch = KNOWLEDGE_BASE.find(kb =>
                        kb.patterns.some(p => lowerMsg.includes(p))
                    );

                    if (kbMatch) {
                        addMessage(kbMatch.answer, 'bot');
                    } else {
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
            text: `Hi${user ? ` ${user.name}` : ''}! 👋 I'm your AI Shopping Assistant.\n\nI can help you find products, give style advice, or answer questions about our store.`,
            timestamp: new Date()
        }]);
        setInputValue('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="bg-white dark:bg-gray-900 w-[400px] h-[650px] rounded-3xl shadow-2xl mb-4 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 flex justify-between items-center text-white relative">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <FaRobot className="text-2xl" />
                                </div>
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                            </div>
                            <div>
                                <span className="font-extrabold text-lg block leading-tight">NAA Stylist</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                    <span className="text-[10px] font-medium tracking-widest uppercase opacity-80">Online Assistant</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={resetChat} className="p-2 hover:bg-white/10 rounded-xl transition-all" title="Reset Chat">
                                <FaRedo size={14} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                <FaTimes size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-5 overflow-y-auto bg-gray-50 dark:bg-gray-950 space-y-6 scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index} className="animate-fade-in">
                                <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] group relative ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                                        <div className={`p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${msg.type === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                        
                                        {msg.type === 'bot' && (
                                            <button 
                                                onClick={() => handleCopy(msg.text, index)}
                                                className="absolute -right-8 top-0 p-2 text-gray-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all"
                                                title="Copy to clipboard"
                                            >
                                                {copiedIndex === index ? <FaCheck className="text-green-500" /> : <FaCopy size={12} />}
                                            </button>
                                        )}
                                        
                                        <span className={`text-[10px] mt-1 block opacity-50 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>

                                {msg.products && msg.products.length > 0 && (
                                    <div className="mt-4 grid grid-cols-1 gap-3">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1 ml-1">Handpicked for you</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {msg.products.map(product => (
                                                <div 
                                                    key={product.id || product._id}
                                                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                                >
                                                    <Link to={`/product/${product.id || product._id}`} onClick={() => setIsOpen(false)} className="block relative aspect-square overflow-hidden">
                                                        <img 
                                                            src={product.image} 
                                                            alt={product.name} 
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                        />
                                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                                                        {product.isNewArrival && (
                                                            <span className="absolute top-2 left-2 bg-indigo-600 text-[8px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">New</span>
                                                        )}
                                                    </Link>
                                                    <div className="p-3">
                                                        <p className="text-xs font-bold truncate dark:text-white group-hover:text-indigo-600 transition-colors">{product.name}</p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">${product.price}</span>
                                                            <button 
                                                                onClick={(e) => handleAddToCart(product, e)}
                                                                className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                                                                title="Add to Cart"
                                                            >
                                                                <FaCartPlus size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start animate-pulse">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isTyping && messages.length > 0 && messages[messages.length - 1].type === 'bot' && (
                            <div className="pt-2 space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <FaLightbulb className="text-yellow-500" />
                                    <span>Quick Suggestions</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedQuestions.map((question, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSuggestedQuestion(question)}
                                            className="text-xs px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all duration-300 border border-gray-100 dark:border-gray-700 shadow-sm"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex gap-2 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={isListening ? "Listening..." : "Message Stylist..."}
                                className="flex-1 px-4 py-2.5 bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
                            />
                            <div className="flex gap-1.5">
                                <button
                                    onClick={handleVoiceInput}
                                    className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    title="Voice Input"
                                >
                                    <FaMicrophone size={16} />
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                    className="w-10 h-10 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-indigo-600/20"
                                >
                                    <FaPaperPlane size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-16 h-16 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white rounded-[2rem] shadow-2xl hover:scale-110 hover:rotate-3 transition-all duration-500 flex items-center justify-center group z-50 overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {isOpen ? <FaTimes size={24} /> : (
                    <div className="relative">
                        <FaRobot size={28} className="group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
