
// Mocking the getMockReply logic extraction for testing
// (In valid integration, this logic runs inside the controller)

const getMockReply = (msgs) => {
    const recentHistory = msgs.slice(-3).map(m => m.content.toLowerCase()).join(' ');
    const lastMsg = msgs[msgs.length - 1].content.toLowerCase();

    // Copy-paste logic from controller for verification
    const isMen = /\b(men|man|boy|guy|him|male)\b/i.test(lastMsg) || (/\b(men|man|boy|guy|him|male)\b/i.test(recentHistory) && lastMsg.length < 20);
    const isWomen = /\b(women|woman|girl|lady|her|female)\b/i.test(lastMsg) || (/\b(women|woman|girl|lady|her|female)\b/i.test(recentHistory) && lastMsg.length < 20);
    const isWedding = /\b(wedding|marriage|groom|bride|formal|suit)\b/i.test(lastMsg) || (/\b(wedding|marriage)\b/i.test(recentHistory) && (isMen || isWomen));

    if (isWedding) {
        if (isMen) return "Men's Wedding Logic";
        if (isWomen) return "Women's Wedding Logic";
        return "General Wedding Logic";
    }
    return "Fallback";
};

// Scenario 1: Wedding Query
console.log("1. 'wedding':", getMockReply([{ content: "show me wedding outfits" }]));

// Scenario 2: Contextual Follow-up "for men"
console.log("2. 'wedding' -> 'for men':", getMockReply([
    { content: "show me wedding outfits" },
    { content: "General Wedding Logic" }, // bot reply
    { content: "for men" }
]));

// Scenario 3: Contextual Follow-up "for women"
console.log("3. 'wedding' -> 'for women':", getMockReply([
    { content: "show me wedding outfits" },
    { content: "General Wedding Logic" },
    { content: "what about for women?" }
]));
