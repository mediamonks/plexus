import { v4 as uuidv4 } from 'uuid';
import Config from './Config';
import Plexus from '../Plexus';

const MAX_PIPS = 20;

class Activity {
	constructor(private label: string, private max?: number) {}
	
	public id: string = uuidv4();
	public isDone: boolean = false;
	
	private value?: number = 0;
	
	public get output(): string {
		let progress: string;
		if (this.max) {
			const pips: number = this.isDone ? MAX_PIPS : Math.round((this.value / this.max) * MAX_PIPS);
			progress = '='.repeat(pips) + ' '.repeat(Math.max(MAX_PIPS - pips, 0));
		} else {
			progress = this.isDone ? '✓' : (this.value ? ['|', '/', '-', '\\'][this.value % 4] : '·');
		}
		
		return `[${progress}] ${this.label}`;
	}
	
	public progress(value?: number): void {
		if (value !== undefined) this.value = value;
		else this.value = (this.value ?? 0) + 1;
		
		Console.outputActivity();
	}
	
	public done(): void {
		this.isDone = true;
		Console.outputActivity();
	}
}

export default class Console {
	private static _activities: Activity[] = [];
	private static _lastOutputLines: number = 0;
	
	public static OUTPUT_TYPE = {
		STATUS: 'STATUS',
		DUMP: 'DUMP',
		PERF: 'PERF',
	} as const;
	
	public static output(type: string, ...args: any[]) {
		if (type === this.OUTPUT_TYPE.DUMP && !Config.get('dataDumps')) return;
		if (type === this.OUTPUT_TYPE.PERF && !Config.get('profiling')) return;
		
		switch (process.env['PLEXUS_MODE']) {
			case 'service':
				console.debug(`[${type}]`, ...args);
				break;
			case 'sdk':
				Plexus.instance?.emit('message', { type, args });
				break;
			case 'cli':
				process.stderr.write(`[${type}] ${args.map(arg =>
					typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
				).join(' ')}\n`);
				break;
			default:
				console.debug(`[${type}]`, ...args);
				break;
		}
	}
	
	public static start(label: string, max?: number): Activity {
		if (this._activities.length && !this._activities.filter(activity => !activity.isDone).length) {
			this._activities = [];
			this._lastOutputLines = 0;
		}
		
		const activity = new Activity(label, max);
		
		this._activities.push(activity);
		
		this.outputActivity();
		
		return activity;
	}
	
	public static outputActivity(): void {
		if (process.env['PLEXUS_MODE'] !== 'cli') return;
		
		if (this._lastOutputLines) {
			process.stderr.write(`\x1b[${this._lastOutputLines}A\r`);
		}
		
		this._lastOutputLines = this._activities.length;
		
		for (const activity of this._activities) process.stderr.write(activity.output + '\n');
	}
}
