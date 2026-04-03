
const lastMsg = "show me some weddings outfits";

const isShoeMatch = lastMsg.includes('sho');
console.log(`Message: "${lastMsg}"`);
console.log(`Matches 'sho' (includes): ${isShoeMatch}`); // Expect true (bug)

const fixedRegex = /\b(shoe|shoes|sneaker|sneakers|footwear)\b/i;
console.log(`Matches 'shoe' (regex): ${fixedRegex.test(lastMsg)}`); // Expect false (fix)
