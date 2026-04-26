const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function test() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const apiKey = envContent.match(/GEMINI_API_KEY=(.*)/)[1].trim();
  const genAI = new GoogleGenerativeAI(apiKey);

  const modelsToTest = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-flash-latest',
    'gemini-pro-latest',
    'gemma-3-4b-it'
  ];

  for (const m of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hello");
      console.log(`✅ ${m} WORKS!`);
      // If we find one that works, we can stop or check all.
    } catch (e) {
      console.log(`❌ ${m} FAILED: ${e.message.split('\n')[0]}`);
    }
  }
}

test();
