
// Mocking the getSmartMockReply logic for robust testing
const getSmartMockReply = (msgs) => {
    // Copy-paste the EXACT logic from chatController.js here for local simulation
    // This allows us to verify logic without needing the server running

    const recentHistory = msgs.slice(-3).map(m => m.content.toLowerCase()).join(' ');
    const lastMsg = msgs[msgs.length - 1].content.toLowerCase();

    const isMen = /\b(men|man|boy|guy|him|male|mens)\b/i.test(lastMsg) || (/\b(men|man|boy|guy|him|male|mens)\b/i.test(recentHistory) && !/\b(women|woman|girl|lady|her|female|womens)\b/i.test(lastMsg));
    const isWomen = /\b(women|woman|girl|lady|her|female|womens)\b/i.test(lastMsg) || (/\b(women|woman|girl|lady|her|female|womens)\b/i.test(recentHistory) && !/\b(men|man|boy|guy|him|male|mens)\b/i.test(lastMsg));

    // Size Logic
    if (lastMsg.includes('5\'9') || lastMsg.includes('kg')) {
        return `Based on your height, a ${isMen ? 'Large (L)' : 'Medium (M)'} fits best.`;
    }

    // Budget Logic
    const budgetMatch = lastMsg.match(/under\s?\$?(\d+)/i);
    if (budgetMatch) {
        return `Options under $${budgetMatch[1]}: Classic Tee ($25).`;
    }

    // Gender Strictness Logic
    if (lastMsg.includes('dress')) return isMen ? "We don't have men's dresses." : "Check out our Summer Dress.";

    return "Fallback";
};

console.log("--- TEST REPORT ---");
// 1. Gender Mixing Test
console.log("1. Men asking for dresses:", getSmartMockReply([{ content: "show me men's dresses" }]));

// 2. Size Advice Test
console.log("2. Size 5'9 (Men):", getSmartMockReply([{ content: "I am a man 5'9 75kg" }]));

// 3. Budget Test
console.log("3. Under $30:", getSmartMockReply([{ content: "show me something under $30" }]));

// 4. Context Test
console.log("4. Context Retention (Men):", getSmartMockReply([
    { content: "show me mens outfits" },
    { content: "Fallback" },
    { content: "do you have dresses?" }
]));
