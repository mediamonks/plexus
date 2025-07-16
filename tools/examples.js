const fs = require('node:fs/promises');
const path = require('node:path');
const vertexai = require('../src/services/vertexai');
const pdf = require('../src/utils/pdf');

const DIR = '../temp/examples';

(async function () {
	const systemInstructions = await fs.readFile('./examples.txt', 'utf8');
	const files = await fs.readdir(DIR);
	let output = [];
	for (const file of files) {
		let done = false;
		let text = await pdf.getPdfText(path.join(DIR, file));
		while (!done) {
			const response = await vertexai.query(text, { systemInstructions, structuredResponse: true });
			console.log(response);
			try {
				const data = JSON.parse(response);
				output = [...output, ...data.items];
				({ done } = data);
				text = 'next';
			} catch (error) {
				text = 'It appears the previous batch was too long. Can you send only the first half and then continue from there?';
			}
			console.log('>',text);
		}
	}
	await fs.writeFile('./examples.json', JSON.stringify(output, undefined, 2));
}());
