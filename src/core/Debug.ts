import fs from 'node:fs/promises';
import path from 'node:path';
import Config from './Config';
import Console from './Console';
import RequestContext from './RequestContext';
import { JsonField } from '../types/common';

type MessageLogEntry = {
	type: 'message';
	topic?: string;
	message: string;
};

type DumpLogEntry = {
	type: 'dump';
	label: string;
	data: JsonField;
};

export type DebugLogEntry = {
	ts: number;
} & (MessageLogEntry | DumpLogEntry);

export default class Debug {
	private static get _log(): DebugLogEntry[] {
		return RequestContext.get('debug', []) as DebugLogEntry[];
	}
	
	private static _formatData(data: JsonField): [string | number | boolean] | [string, number] {
		switch (typeof data) {
			case 'string':
				data = data.replace(/\n/g, '\\n');
				if (data.length <= 100) return [data as string];
				return [data.substring(0, 99) + '…', data.length];
			case 'number':
			case 'boolean':
				return [data];
			default:
				return this._formatData(JSON.stringify(data));
		}
	}
	
	public static log(message: string, topic?: string): void {
		this._log.push({ ts: Date.now(), type: 'message', topic, message });
		
		Console.output(Console.OUTPUT_TYPE.STATUS, topic && `[${topic}]`, message);
	}
	
	public static dump(label: string, data: any): void {
		this._log.push({ ts: Date.now(), type: 'dump', label, data });
		
		void this.writeDumpFile(label, data);
		
		Console.output(Console.OUTPUT_TYPE.DUMP, `[${label}]`, ...this._formatData(data));
	}
	
	public static get(): DebugLogEntry[] {
		return this._log;
	}
	
	private static async writeDumpFile(label: string, data: string | object): Promise<void> {
		const dumpFilePath: string = path.join(Config.get('tempPath') as string, 'dump');
		
		await fs.mkdir(dumpFilePath, { recursive: true });
		
		let content: string;
		let extension: string = 'txt';
		if (typeof data === 'object') {
			content = JSON.stringify(data, null, 2);
			extension = 'json';
		} else {
			content = data;
		}
		
		const filename: string = label.replace(/\W/g, '_');
		
		return fs.writeFile(path.join(dumpFilePath, `${filename}.${extension}`), content);
	}
};
