export const chatWithAI = async (req, res) => {
    // Robust error handling for body
    if (!req.body || !req.body.messages) {
        return res.status(400).json({ error: "Invalid request body" });
    }

    const { messages } = req.body;
    const userMessage = messages[messages.length - 1].content.toLowerCase();

    // Use mock AI logic if no API key is set or if using a placeholder
    // OpenAI keys usually start with 'sk-' and are long. Quick check to avoid API errors.
    const isPlaceholderKey = !process.env.OPENAI_API_KEY ||
        openai.apiKey === 'dummy-key-placeholder' ||
        openai.apiKey.startsWith('your_') ||
        openai.apiKey.length < 20;

    if (isPlaceholderKey) {
        console.log("Processing with Mock AI (Placeholder/No Key detected):", userMessage);
        const reply = await getSmartMockReply(messages);
        return res.json({ reply });
    }

    // === REAL GPT-4 LOGIC ===
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are an expert AI Shopping Assistant for NAA. 
                    Context: ${productsContext}
                    Guidelines: Be helpful, mention prices, and suggest products.`
                },
                ...messages
            ],
            max_tokens: 300,
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI Error:', error);
        const reply = await getSmartMockReply(messages);
        res.status(200).json({ reply });
    }
};

// === 🧠 SMART MOCK BRAIN (EXPERT SYSTEM) ===

const getSmartMockReply = async (msgs) => {
    // Simulate network latency for realism
    await new Promise(r => setTimeout(r, 600));

    const recentHistory = msgs.slice(-3).map(m => m.content.toLowerCase()).join(' ');
    const lastMsg = msgs[msgs.length - 1].content.toLowerCase();

    // --- 1. CONTEXT EXTRACTION ---
    const isMen = /\b(men|man|boy|guy|him|male|mens)\b/i.test(lastMsg) || (/\b(men|man|boy|guy|him|male|mens)\b/i.test(recentHistory) && !/\b(women|woman|girl|lady|her|female|womens)\b/i.test(lastMsg));
    const isWomen = /\b(women|woman|girl|lady|her|female|womens)\b/i.test(lastMsg) || (/\b(women|woman|girl|lady|her|female|womens)\b/i.test(recentHistory) && !/\b(men|man|boy|guy|him|male|mens)\b/i.test(lastMsg));

    // Default to strict gender filtering if detected
    const genderPrefix = isMen ? "Men's " : (isWomen ? "Women's " : "");

    // --- 2. INTENT CLASSIFICATION ---

    // > Category 3: SIZE & FIT
    const heightRegex = /(\d+)\s?(?:ft|'|feet)\s?(\d+)?/i; // 5'9 or 5ft 9
    const weightRegex = /(\d+)\s?(?:kg|lbs)/i;
    if (heightRegex.test(lastMsg) || weightRegex.test(lastMsg) || lastMsg.includes('size') || lastMsg.includes('fit') || lastMsg.includes('measure')) {
        if (lastMsg.includes('sho') || lastMsg.includes('sneak')) return "For shoes, our sizes depend on the region (US/UK). Generally, we recommend ordering your true size for sneakers.";
        if (heightRegex.test(lastMsg)) {
            return `Based on your height, a ${isMen ? 'Large (L)' : 'Medium (M)'} would likely be the best fit for length. Our cuts are modern and tailored.`;
        }
        return "Our sizing runs true-to-fit! 📏 For a relaxed look, size up. For a tailored fit, stick to your standard size. Check the Size Chart on the product page for exact measurements.";
    }

    // > Category 8: PRICE / BUDGET
    const budgetMatch = lastMsg.match(/under\s?\$?(\d+)/i) || lastMsg.match(/budget/);
    if (budgetMatch) {
        const budget = budgetMatch[1] ? parseInt(budgetMatch[1]) : 0;
        if (budget > 0 && budget < 40) return `For under $${budget}, check out our [Classic Tee] ($25) or [Graphic T-Shirt] ($29.99). Great style doesn't have to break the bank! 💸`;
        if (budget > 0) return `We have plenty of options under $${budget}! The [Summer Dress] ($39.99) or [Slim Fit Jeans] ($45) would be perfect.`;
        return "We have fashion for every budget! T-Shirts start at $25, while our premium Leather Jackets are $120. What's your price range?";
    }

    // > Category 10 & 11: POLICIES (Returns, Delivery)
    if (lastMsg.includes('return') || lastMsg.includes('exchange') || lastMsg.includes('refund')) {
        return "✅ **Return Policy**: You can return or exchange any unworn item within **30 days** of purchase. Just keep the tags on!";
    }
    if (lastMsg.includes('ship') || lastMsg.includes('delivery') || lastMsg.includes('track') || lastMsg.includes('arrive')) {
        return "🚚 **Shipping Info**: \n- Free Shipping on orders over $100.\n- Standard Delivery: 3-5 business days.\n- Express Delivery: 1-2 business days.";
    }

    // > Category 4 & 5: STYLING & ACCESSORIES
    if (lastMsg.includes('match') || lastMsg.includes('wear with') || lastMsg.includes('style') || lastMsg.includes('accessories')) {
        if (lastMsg.includes('dress')) return "A dress pairs beautifully with our [Minimalist Watch] ($125) for elegance, or a [Leather Belt] to cinch the waist.";
        if (lastMsg.includes('jeans')) return "Jeans are versatile! Style them with a [Graphic T-Shirt] for a casual vibe, or a [Casual Blazer] to dress them up.";
        if (lastMsg.includes('suit') || lastMsg.includes('formal')) return "For a formal look, you need the right accessories. A [Leather Belt] ($35.99) and [Watch] are essential finishing touches.";
        return "I love styling! ✨ Tell me which item you're trying to match, and I'll give you a pro tip.";
    }

    // > Category 6: OCCASIONS (Wedding, Party, Office, Gym)
    const isWedding = /\b(wedding|marriage|groom|bride|formal|suit)\b/i.test(lastMsg);
    const isParty = /\b(party|club|night|event|date|dance)\b/i.test(lastMsg);
    const isGym = /\b(gym|run|workout|sport|active|yoga|train)\b/i.test(lastMsg);
    const isOffice = /\b(office|work|job|interview|professional)\b/i.test(lastMsg);
    const isSummer = /\b(summer|beach|sun|hot|vacation)\b/i.test(lastMsg);
    const isWinter = /\b(winter|cold|snow|jacket|coat)\b/i.test(lastMsg);

    if (isWedding) {
        if (isMen) return "For a wedding, look sharp with our [Casual Blazer] ($89.99) paired with Chinos. Add a [Leather Belt] to complete the look! 💍";
        if (isWomen) return "Wedding guest? 🌸 Our [Maxi Dress] ($65.99) is elegant and comfortable for all-day celebrations.";
        return "Weddings require the best! For men, I suggest a Blazer. For women, a flowing Dress. Who are you shopping for?";
    }
    if (isParty) {
        if (isMen) return "Party time! 🕺 Stand out with a [Leather Jacket] ($120) over a white tee. Cool, classic, and confident.";
        if (isWomen) return "Turn heads! ✨ The [Summer Dress] ($39.99) is perfect for day parties, while the [Maxi Dress] is great for evening elegance.";
        return "Let's find a party outfit! A Leather Jacket or a chic Dress is always a winner. What's the vibe of the party?";
    }
    if (isOffice) {
        return `For the office 💼, I recommend the ${isWomen ? '[Blazer] ($79.99) and [Skinny Jeans]' : '[Casual Blazer] ($89.99) and Chinos'}. Smart-casual is the way to go!`;
    }
    if (isGym) {
        return "Get moving! 🏃‍♂️ Check out our [Running Shoes] ($89.99) and breathable [Classic Tee] ($25). Function meets fashion.";
    }
    if (isSummer) return "Summer vibes! ☀️ Stay cool in our [Classic Tee] and [Summer Dress]. Don't forget [Sunglasses] ($45.99)!";
    if (isWinter) return "Stay warm! ❄️ Our [Oversized Hoodie] ($59.99) and [Leather Jacket] are winter essentials.";

    // > Category 7 & 9: FABRIC & COMPARISONS
    if (lastMsg.includes('cotton') || lastMsg.includes('fabric') || lastMsg.includes('material')) {
        return "We use premium materials! 🧵 Our Tees are 100% Organic Cotton, extremely soft and breathable. Our Jackets use genuine vegan leather.";
    }
    if (lastMsg.includes('better') || lastMsg.includes('compare') || lastMsg.includes('vs')) {
        return "Both are great choices! The [Leather Jacket] is warmer and edgier, while the [Casual Blazer] is lighter and more formal. Choose based on your occasion!";
    }

    // > Category 1: DISCOVERY (General Browsing)
    if (lastMsg.includes('dress')) return isMen ? "We don't have men's dresses, but our [Casual Blazer] allows for a stylish formal look!" : "We have beautiful dresses! 👗 Check out the [Summer Dress] ($39.99) or [Maxi Dress] ($65.99).";
    if (lastMsg.includes('jacket') || lastMsg.includes('coat')) return isWomen ? "For women, our [Blazer] ($79.99) is a chic layer." : "Layer up! The [Leather Jacket] ($120) is a timeless investment.";
    if (lastMsg.includes('hoodie') || lastMsg.includes('sweat')) return "Comfort level: 100. ☁️ Our [Oversized Hoodie] ($59.99) is super soft and unisex!";
    if (lastMsg.includes('jeans') || lastMsg.includes('pants')) return isMen ? "Focus on fit. Try our [Slim Fit Jeans] ($45) or Chinos." : "Our [Skinny Jeans] ($52.99) offer a flattering silhouette and great stretch.";
    if (lastMsg.includes('shoe') || lastMsg.includes('sneak')) return "Step out in style. 👟 Our [Running Shoes] ($89.99) look great at the gym or on the street.";

    // GREETING
    if (/\b(hello|hi|hey|greetings|start)\b/i.test(lastMsg) && !/\b(shipping|policy)\b/i.test(lastMsg)) {
        return "Hello! 👋 I'm your Personal Stylist. Ask me about **size**, **styling**, **occasions**, or even **budget** options! What can I help you find?";
    }

    // FINAL FALLBACK
    if (isMen) return "For men, I'm loving the [Leather Jacket] and [Slim Fit Jeans] combo right now. Need help with sizing or colors?";
    if (isWomen) return "For women, the [Summer Dress] and [Blazer] are trending. I can help you style them or find the right size!";

    return "I can help with **Style Advice**, **Sizing**, **Occasions**, and more! Try asking 'What should I wear to a wedding?' or 'Do you have items under $50?'";
};
