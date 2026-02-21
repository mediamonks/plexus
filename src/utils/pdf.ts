import pdf from 'pdf-parse-debugging-disabled';

async function getText(filePath: string): Promise<string> {
	const data = await pdf(filePath);
	return data.text;
}

export default { getText };
