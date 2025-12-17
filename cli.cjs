const minimist = require('minimist');
const RequestContext = require('./dist/core/RequestContext').default;
const ErrorHandler = require('./dist/entities/error-handling/ErrorHandler').default;
const ingestHandler = require('./dist/handlers/ingest').default;
const invokeHandler = require('./dist/handlers/invoke').default;
const CloudStorage = require('./dist/services/google-cloud/CloudStorage').default;

const argv = minimist(process.argv.slice(2));

const [command, configName, ...args] = argv._;

const COMMANDS = {
	ingest: () => {
		const [namespace] = args;
		const fn = ingestHandler.bind(null, namespace);
		return { fn };
	},
	invoke: () => {
		const [fields, threadId] = args;
		const fn = invokeHandler.bind(null, null, { threadId });
		return { fields, fn };
	},
};

function sendHelp() {
	const help = `Usage: plexus <COMMAND> <CONFIG> [ARGUMENTS] [OPTIONS]'

Commands:
  ingest    Ingest data from a set of data sources
            arguments:
              - namespace (optional)
            example: \`plexus ingest myconfig mynamespace\`
    
  invoke    Invoke the pipeline
            arguments:
              - JSON input fields object (optional)
              - thread ID (optional)
            example: \`plexus invoke myconfig '{"userInput": "Hello, how are you?"}' 0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a\`

Options:
  --profile, -p    Enable profiling
  --dump, -d       Enable data dumps
  --no-warmup, -W  Skip GCS authentication warmup
`
	console.error(help);
	process.exit(1);
}

async function authentication() {
	if (argv['no-warmup'] ?? argv['W']) return;
	
	console.log('Warming up GCS authentication...');
	const startTime = performance.now();
	
	try {
		await CloudStorage.list('gs://monks-plexus');
		
		console.log(`GCS authentication warmup completed in ${Math.floor(performance.now() - startTime)}ms`);
	} catch (error) {
		console.warn('GCS authentication failed:', error.message);
	}
}

if (!COMMANDS[command] || !configName) sendHelp();

const configPath = `./config/${configName}.json`;

let config;
try {
	config = require(configPath);
} catch (error) {
	console.error(`Configuration "${configPath}" not found.\n`);
	sendHelp();
}

config.profiling = argv.profile ?? argv.p ?? false;
config.dataDumps = argv.dump ?? argv.d ?? false;

const { fn, fields } = COMMANDS[command]();

process.env.PLEXUS_MODE = 'cli';

(async function () {
	await RequestContext.create({ payload: { config, fields } }, async () => {
		ErrorHandler.initialize();

		await authentication();
	
		try {
			console.log(await fn());
		} catch (error) {
			ErrorHandler.log(error);
		}
	});
}());
