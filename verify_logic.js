
const msg = "what are your shipping policies?";
const isHello = /\b(hello|hi|hey)\b/i.test(msg);
const isShipping = msg.includes('ship') || msg.includes('delivery');

console.log(`Message: "${msg}"`);
console.log(`Regex Matches Hello: ${isHello}`);
console.log(`Matches Shipping: ${isShipping}`);
