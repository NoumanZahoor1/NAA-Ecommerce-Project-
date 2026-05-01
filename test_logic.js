
const msg = "what are your shipping policies?";
const isHello = msg.includes('hello') || msg.includes('hi') || msg.includes('hey');

console.log(`Message: "${msg}"`);
console.log(`Contains 'hi' (simple string match): ${msg.includes('hi')}`);
console.log(`Triggers Hello Response: ${isHello}`);
