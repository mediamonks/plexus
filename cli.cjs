require('dotenv').config();
process.env.PLEXUS_MODE = 'cli';

const minimist = require('minimist');
const fs = require('node:fs');
const Console = require('./dist/core/Console').default;
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
		const fn = ingestHandler.bind(null, { namespace });
		return { fn };
	},
	invoke: () => {
		const [fieldsJson, threadId] = args;
		const fn = invokeHandler.bind(null, null, { threadId });
		let fields = {};
		if (fieldsJson) {
			try {
				fields = JSON.parse(fieldsJson);
			} catch {
				console.error(`Input fields JSON invalid.\n`);
				sendHelp();
			}
		}
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
	
	const startTime = performance.now();
	const activity = Console.start('Warming up GCS authentication...', 15000);
	const interval = setInterval(
		() => activity.progress(performance.now() - startTime),
		100
	);
	
	try {
		await CloudStorage.list('gs://monks-plexus');
		activity.done();
		console.error(`GCS authentication warmup completed in ${Math.floor(performance.now() - startTime)}ms`);
	} catch (error) {
		activity.done();
		console.error('GCS authentication failed:', error.message);
	}

	clearInterval(interval);
}

function formatTime(ms) {
	const hours = Math.floor(ms / 1000 / 60 / 60);
	const minutes = Math.floor((ms / 1000 / 60) % 60);
	const seconds = Math.floor((ms / 1000) % 60);
	const milliseconds = Math.floor(ms % 1000);
	return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
}

if (!COMMANDS[command] || !configName) sendHelp();

const configPath = `./config/custom/${configName}.json`;

if (!fs.existsSync(configPath)) {
	console.error(`Configuration "${configPath}" not found.\n`);
	sendHelp();
}
let config;
try {
	config = require(configPath);
} catch (error) {
	console.error(`Configuration "${configPath}" is invalid JSON.\n`);
	sendHelp();
}

config.profiling = argv.profile ?? argv.p ?? false;
config.dataDumps = argv.dump ?? argv.d ?? false;

const { fn, fields } = COMMANDS[command]();

(async function () {
	await RequestContext.create({ payload: { config, fields } }, async () => {
		ErrorHandler.initialize();

		await authentication();
	
		try {
			const startTime = performance.now();
			const result = await fn();
			const time = Math.floor(performance.now() - startTime);
			if (result) console.log(JSON.stringify(result, null, 2));
			console.error(`\n${command} operation completed in ${formatTime(time)}ms`);
		} catch (error) {
			ErrorHandler.log(error);
		}
		process.exit(0);
	});
}());
