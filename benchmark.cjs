require('dotenv').config();

const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = 'gpt-5-nano-2025-08-07';

(async function () {
	const t1 = Date.now();
	await client.chat.completions.create({
		model,
		messages: [{ role: "user", content: "Hello" }],
		max_completion_tokens: 16,
	});
	console.log("chat.completions:", Date.now() - t1, "ms");
	
	const t0 = Date.now();
	await client.responses.create({
		model,
		input: "Hello",
		max_output_tokens: 16,
	});
	console.log("responses:", Date.now() - t0, "ms");
}());
