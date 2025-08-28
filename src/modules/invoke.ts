import Catalog from '../entities/catalog/Catalog';
import config from '../utils/config';
import History from '../utils/History';
import RequestContext from '../utils/RequestContext';

export default async function invoke(): Promise<Record<string, any>> {
	let { threadId } = RequestContext.get('payload');
	
	History.create(threadId);
	
	const output = config.get('output');
	
	if (!output || !output.length) throw new Error('No output specified');
	
	const result = {};
	await Promise.all(output.map(async outputField => {
		result[outputField] = await Catalog.instance.get(outputField).getValue();
	}));
	
	History.instance.save(result);
	
	return result;
};
