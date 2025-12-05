import CustomError from '../entities/error-handling/CustomError';

type Module = {
	default?: (...args: unknown[]) => Promise<void>;
	[key: string]: (...args: unknown[]) => Promise<void>;
}

export default async (_: void, { fn, args = [] }: { fn: string; args?: any[] }): Promise<void> => {
	if (!fn.match(/^[\w/]+(\.\w+)?$/)) {
		throw new CustomError(`Invalid delegate function format: "${fn}". Must be either [module name] or [module name].[function name]. Module name may contain forward slashes for pathing.`);
	}
	
	const [moduleName, functionName] = fn.split('.');
	let module: Module;
	try {
		module = await import(`../modules/${moduleName}`);
	} catch (error) {
		throw new CustomError(`Invalid delegate function. Module "${moduleName}" could not be loaded.`);
	}
	
	if (functionName && (!module[functionName] || typeof module[functionName] !== 'function')) {
		throw new CustomError(`Invalid delegate function. Function "${functionName} does not exist on module "${moduleName}".`);
	}
	
	await (functionName ? module[functionName] : module.default)(...args);
};
