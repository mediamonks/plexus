import Config from './Config';

export default class Console {
	public static OUTPUT_TYPE = {
		STATUS: 'STATUS',
		DUMP: 'DUMP',
		PERF: 'PERF',
	} as const;
	
	static output(type: string, ...args: any[]) {
		if (type === this.OUTPUT_TYPE.DUMP && !Config.get('dataDumps')) return;
		if (type === this.OUTPUT_TYPE.PERF && !Config.get('profiling')) return;
		
		switch (process.env['PLEXUS_MODE']) {
			case 'service':
			case 'sdk':
				console.debug(`[${type}]`, ...args);
				break;
			case 'cli':
				console.log(`[${type}]`, ...args);
				break;
			default:
				console.debug(`[${type}]`, ...args);
				break;
		}
	}
}
