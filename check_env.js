
import dotenv from 'dotenv';
dotenv.config();

console.log("OpenAI Key Present:", !!process.env.OPENAI_API_KEY);
console.log("Key value (masked):", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 5) + '...' : 'None');
