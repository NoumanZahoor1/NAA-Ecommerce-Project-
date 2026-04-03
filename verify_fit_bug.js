
const lastMsg = "I need a casual outfit";
const isFitMatch = /\bfit\b/i.test(lastMsg);
console.log(`Message: "${lastMsg}"`);
console.log(`Matches 'fit' (strict regex): ${isFitMatch}`); // Expect false
