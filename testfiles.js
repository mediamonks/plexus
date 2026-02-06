require("dotenv").config({ path: "/home/n0cha/dev/bosch/source/chatbot/.env" });
process.env.GOOGLE_APPLICATION_CREDENTIALS = "/home/n0cha/dev/bosch/source/chatbot/auth/credentials.json";

const { GoogleGenAI } = require("@google/genai");
const CloudStorage = require("./dist/services/google-cloud/CloudStorage").default;
const Plexus = require("./dist/Plexus").default;

async function test() {
	const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
	
	const prefixes = ['gs://bosch-sales-agent-test-docs/sales-plays', 'gs://bosch-sales-agent-test-chatbot/files/sales-plays'];
	
	await Promise.all(prefixes.map(async prefix => {
		const files = await CloudStorage.list(prefix);
		
		await Promise.all(files.map(async uri => {
			try {
				const signedUrl = await CloudStorage.getSignedUrl(uri);
				const response = await client.models.generateContent({
					model: "gemini-2.5-flash-lite",
					contents: [
						{ fileData: { mimeType: "application/pdf", fileUri: signedUrl } },
						"How many pages?"
					]
				});
				console.log(`✓ ${uri}: ${response.text.trim()}`);
			} catch (err) {
				console.log(`✗ ${uri}: ${err.message}`);
			}
		}));
	}));
}

const plexus = new Plexus();

plexus.context(test);
