import path from 'node:path';
import neo4j, { Driver, Session } from 'neo4j-driver';
import Config from '../../core/Config';
import Docker, { ContainerOptions } from '../docker/Docker';
import { JsonField, JsonObject } from '../../types/common';

const BOLT_PORT = 7687;
const HTTP_PORT = 7474;
const LAB_PORT = 3000;
const MEMGRAPH_IMAGE = 'memgraph/memgraph-platform:latest';

export default class Neo4j {
	private static _client: Driver;
	
	public static async query(cypher: string, params?: Record<string, unknown>): Promise<JsonObject[]> {
		const session = await this.getSession();
		
		try {
			const result = await session.run(cypher, params);
			
			return result.records.map(record => {
				const obj: JsonObject = {};
				record.keys.forEach((key: string) => {
					obj[key] = this.convertValue(record.get(key));
				});
				return obj;
			});
		} finally {
			await session.close();
		}
	}
	
	public static async run(cypher: string, params?: Record<string, unknown>): Promise<void> {
		const session = await this.getSession();
		
		try {
			await session.run(cypher, params);
		} finally {
			await session.close();
		}
	}
	
	public static async clearByLabel(label: string): Promise<void> {
		await this.run(`MATCH (n:\`${label}\`) DETACH DELETE n`);
	}
	
	public static async createNodes(label: string, data: JsonObject[] | AsyncGenerator<JsonObject>): Promise<void> {
		const records = Array.isArray(data) ? data : await Array.fromAsync(data);
		if (records.length === 0) return;
		await this.run(`UNWIND $records AS r CREATE (n:\`${label}\`) SET n = r`, { records });
	}
	
	private static async getSession(): Promise<Session> {
		const client = await this.getClient();
		return client.session();
	}
	
	private static async getClient(): Promise<Driver> {
		if (this._client) return this._client;
		
		const ports = await Docker.start(this.getContainerConfig());
		
		this._client = neo4j.driver(
			`bolt://localhost:${ports[BOLT_PORT]}`,
			neo4j.auth.basic('', '')
		);
		
		await this._client.getServerInfo();
		
		return this._client;
	}
	
	private static convertValue(value: unknown): JsonField {
		if (value === null || value === undefined) return null;
		
		if (typeof value === 'object' && 'toNumber' in value) {
			return (value as { toNumber: () => number }).toNumber();
		}
		
		if (Array.isArray(value)) {
			return value.map(v => this.convertValue(v));
		}
		
		if (typeof value === 'object' && 'properties' in value) {
			const node = value as { properties: Record<string, unknown> };
			const converted: JsonObject = {};
			for (const [k, v] of Object.entries(node.properties)) {
				converted[k] = this.convertValue(v);
			}
			return converted;
		}
		
		return value as JsonField;
	}
	
	private static getContainerConfig(): ContainerOptions {
		const localDataDir = path.resolve(Config.get('tempPath'), 'memgraph-data');
		
		return {
			image: MEMGRAPH_IMAGE,
			ports: [BOLT_PORT, HTTP_PORT, LAB_PORT],
			binds: [`${localDataDir}:/var/lib/memgraph`],
			healthCheck: { port: HTTP_PORT },
		};
	}
}
