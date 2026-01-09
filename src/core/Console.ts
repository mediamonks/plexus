import Config from './Config';

export default class Console {
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
			case 'sdk':
				console.debug(`[${type}]`, ...args);
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
	
	public static progress(value: number, max: number, label: string = '') {
		if (process.env['PLEXUS_MODE'] !== 'cli') return;
		
		const MAX_PIPS = 20;
		
		const pips = Math.round((value / max) * MAX_PIPS);
		process.stderr.write(`\r[${'='.repeat(pips)}${' '.repeat(Math.max(MAX_PIPS - pips, 0))}] ${label}`);
	}
	
	public static activity(value: number, label: string = '') {
		if (process.env['PLEXUS_MODE'] !== 'cli') return;
		
		const char = ['|', '/', '-', '\\'][value % 4];
		process.stderr.write(`\r[${char}] ${label}`);
	}
	
	public static done() {
		if (process.env['PLEXUS_MODE'] === 'cli') process.stderr.write('\r\n');
	}
}
