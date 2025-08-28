import Agent from './Agent';
import Catalog from '../catalog/Catalog';
import config from '../../utils/config';
import hash from '../../utils/hash';
import UnknownError from '../../utils/UnknownError';

export default class Agents {
	static _agents: { [key: string]: Agent } = {};
	
	static get(id: string, catalog: Catalog): Agent {
		const configuration = config.get(`agents`) as typeof Agent.Configuration;
		
		if (!configuration[id]) throw new UnknownError('agent', id, configuration);
		
		const agent = this._agents[hash(id, JSON.stringify(configuration[id]))] ??= new Agent(id, configuration[id]);
		
		agent.prepare(catalog);
		
		return agent;
	}
}
