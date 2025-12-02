import Agent from './Agent';
import Catalog from '../catalog/Catalog';
import UnknownError from '../error-handling/UnknownError';
import Config from '../../core/Config';
import hash from '../../utils/hash';

export default class Agents {
	private static readonly _agents: Record<string, Agent> = {};
	
	public static get(id: string, catalog: Catalog): Agent {
		const configuration = Config.get(`agents`);
		
		if (!configuration[id]) throw new UnknownError('agent', id, configuration);
		
		const agentConfiguration = configuration[id];
		
		const agent = this._agents[hash(id, JSON.stringify(agentConfiguration))] ??= new Agent(id, agentConfiguration);
		
		agent.prepare(catalog);
		
		return agent;
	}
}
