require('dotenv').config();
process.env.PLEXUS_MODE = 'cli';

const fs = require('node:fs');
const path = require('node:path');
const minimist = require('minimist');
const Plexus = require('./dist/Plexus').default;
const Console = require('./dist/core/Console').default;
const ErrorHandler = require('./dist/entities/error-handling/ErrorHandler').default;
const Storage = require('./dist/entities/storage/Storage').default;

const argv = minimist(process.argv.slice(2));

const [command, ...args] = argv._;

const COMMANDS = {
	ingest: plexus => {
		const [namespace] = args;
		return plexus.ingest(namespace);
	},
	invoke: plexus => {
		const [fieldsJson, threadId] = args;
		
		let fields = {};
		if (fieldsJson) {
			try {
				fields = JSON.parse(fieldsJson);
			} catch {
				console.error(`Input fields JSON invalid.\n`);
				sendHelp();
			}
		}
		
		return plexus.thread(threadId).invoke(fields);
	},
};

function sendHelp() {
	const help = `Usage: plexus [OPTIONS] <COMMAND> [ARGUMENTS]'

Command:
  ingest    Ingest data from a set of data sources
            arguments:
              - namespace (optional)
            example: \`plexus ingest mynamespace\`
    
  invoke    Invoke the pipeline
            arguments:
              - JSON input fields object (optional)
              - thread ID (optional)
            example: \`plexus invoke '{"userInput": "Hello, how are you?"}' 0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a\`

Options:
  --config, -c     Path to configuration file, "./config.json" is used if omitted
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
		await Storage.warmUp();
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

if (!COMMANDS[command]) sendHelp();

const configFile = argv.config ?? argv.c ?? './config.json';
const configPath = path.resolve(process.cwd(), configFile);

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

const plexus = new Plexus(config);

plexus.context(async () => {
	await authentication();
	
	try {
		const startTime = performance.now();
		const result = await COMMANDS[command](plexus);
		const time = Math.floor(performance.now() - startTime);
		if (result) console.log(JSON.stringify(result, null, 2));
		console.error(`\n${command} operation completed in ${formatTime(time)}ms`);
	} catch (error) {
		ErrorHandler.log(error);
	}
	process.exit(0);
});
