import Agent from './Agent';
import Catalog from '../catalog/Catalog';
import config from '../../utils/config';
import hash from '../../utils/hash';
import UnknownError from '../../utils/UnknownError';
import { JsonObject } from '../../types/common';

export default class Agents {
	private static readonly _agents: Record<string, Agent> = {};
	
	public static get(id: string, catalog: Catalog): Agent {
		const configuration = config.get(`agents`) as JsonObject;
		
		if (!configuration[id]) throw new UnknownError('agent', id, configuration);
		
		const agentConfiguration = configuration[id] as JsonObject;
		
		if (!agentConfiguration.context) throw new Error(`Configuration of agent "${id}" is missing required 'context' field`);
		
		const agent = this._agents[hash(id, JSON.stringify(agentConfiguration))] ??= new Agent(id, agentConfiguration);
		
		agent.prepare(catalog);
		
		return agent;
	}
}
