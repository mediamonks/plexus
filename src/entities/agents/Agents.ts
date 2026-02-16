import Agent from './Agent';
import AgentSerializer from './AgentSerializer';
import IAgent from './IAgent';
import Catalog from '../catalog/Catalog';
import UnknownError from '../error-handling/UnknownError';
import Config from '../../core/Config';
import hash from '../../utils/hash';

export default class Agents {
	private static readonly _agents: Record<string, IAgent> = {};
	
	public static get(id: string, catalog: Catalog): IAgent {
		const configuration = Config.get(`agents`);
		
		if (!configuration[id]) throw new UnknownError('agent', id, configuration);
		
		const agentConfiguration = configuration[id];
		
		const key = hash(id, JSON.stringify(agentConfiguration), catalog.id);
		let agent: IAgent = this._agents[key];
		if (!agent) {
			if (agentConfiguration.serialize) {
				agent = new AgentSerializer(id, agentConfiguration);
			} else {
				agent = new Agent(id, agentConfiguration);
			}
			this._agents[key] = agent;
		}
		
		void agent.prepare(catalog);
		
		return agent;
	}
}
