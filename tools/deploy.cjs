const process = require('node:process');
const childProcess = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');
const packageJson = require('../package.json');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const args = require('minimist')(process.argv.slice(2));
let { env, functions, gateway, secrets, _: names } = args;
env ??= 'dev';

if (!functions && !gateway && !secrets) {
	functions = true;
	gateway = true;
	secrets = true;
}

const global = require('../config/deploy.json')[env];

const globalEnv = global.env ?? [];

function gcloud(command, captureOutput = false) {
	const cmd = `gcloud beta ${command.trim().replace(/\s+/g, ' ')} --project=${global.project} --quiet`
	console.log(cmd);
	childProcess.execSync(
		cmd,
		{ stdio: 'inherit' }
	);
}

const projectNumber = childProcess
	.execSync(`gcloud projects describe ${global.project} --format="value(project_number)"`, { encoding: 'utf8' })
	.trim();

async function deployFunction({ name, entryPoint, timeout, env, minInstances, cpus, memory }) {
	entryPoint = entryPoint ?? name;
	
	const secrets = globalEnv.concat(env).filter(Boolean);
	
	const secretsString = secrets
		.map(secret => `${secret}=${secret}:latest`)
		.join(',');
	
	const serviceAccount = global.serviceAccount
		&& (global.serviceAccount.includes('@')
			? global.serviceAccount
			: `${global.serviceAccount}@${global.project}.iam.gserviceaccount.com`);
	
	const buildServiceAccount = global.buildServiceAccount ?? `${projectNumber}-compute`;
	
	for (const secret of secrets) {
		gcloud(`secrets add-iam-policy-binding ${secret}
      --member="serviceAccount:${serviceAccount}"
	    --role="roles/secretmanager.secretAccessor"
	    --project="${projectNumber}"
    `);
	}
	
	gcloud(`
		functions deploy ${name}
			--gen2
			--region=${global.region}
			--runtime=nodejs${packageJson.engines.node}
			--source=.
			--entry-point=${entryPoint}
			--trigger-http
			--project=${global.project}
			--no-allow-unauthenticated
			--build-service-account=projects/${global.project}/serviceAccounts/${buildServiceAccount}@developer.gserviceaccount.com
			${secrets ? `--set-secrets="${secretsString}"` : ''}
			${timeout ? `--timeout=${timeout}s` : ''}
			${serviceAccount ? `--run-service-account=${serviceAccount}` : ''}
			${minInstances ? `--min-instances=${minInstances}` : ''}
			${memory ? `--memory=${memory}` : ''}
			${memory && cpus ? `--cpu=${cpus}` : ''}
	`);
}

async function updateGateway({ gateway, region, config, api, serviceAccount = global.serviceAccount }) {
	serviceAccount = serviceAccount
		&& (serviceAccount.includes('@')
			? serviceAccount
			: `${serviceAccount}@${global.project}.iam.gserviceaccount.com`);
	
	try {
		gcloud(`
				api-gateway gateways delete ${gateway}
				--location=${region ?? global.region}
		`);
	} catch (error) {
	}
	
	try {
		gcloud(`
				api-gateway api-configs delete ${config}
				--api=${api}
		`);
	} catch (error) {
	}
	
	gcloud(`
		api-gateway api-configs create ${config}
    --api=${api}
	  --openapi-spec=config/openapi.yaml
    ${serviceAccount ? `--backend-auth-service-account=${serviceAccount}` : ''}
	`);
	
	gcloud(`
		api-gateway gateways create ${gateway}
    --api=${api}
    --api-config=${config}
    --location=${region ?? global.region}
	`);
}

async function updateSecrets() {
	const rl = readline.createInterface({
		input: fs.createReadStream(path.resolve(__dirname, '../.env')),
		crlfDelay: Infinity
	});
	const secretManagerServiceClient = new SecretManagerServiceClient({ projectId: global.project });
	
	for await (const line of rl) {
		if (!line.trim()) continue;
		const [varName, value] = line.split('=');
		const secretName = `projects/${global.project}/secrets/${varName.trim()}`;
		
		try {
			await secretManagerServiceClient.getSecret({ name: secretName });
		} catch (error) {
			if (error.code !== 5) throw error;
			
			await secretManagerServiceClient.createSecret({
				parent: `projects/${global.project}`,
				secretId: varName,
				secret: {
					replication: {
						automatic: {},
					},
				},
			});
		}
		
		try {
			const [version] = await secretManagerServiceClient.accessSecretVersion({
				name: `${secretName}/versions/latest`,
			});
			const currentValue = version.payload?.data?.toString('utf8');
			if (currentValue === value.trim()) continue;
		} catch (error) {
		}
		
		await secretManagerServiceClient.addSecretVersion({
			parent: secretName,
			payload: {
				data: Buffer.from(value.trim(), 'utf8'),
			},
		});
	}
}

(async () => {
	if (secrets) await updateSecrets();
	
	if (functions) {
		if (!names.length) names = global.functions.map(fn => fn.name);
		
		for (const name of names) {
			const definition = global.functions.find(item => item.name === name);
			if (!definition) {
				console.error(`Error: no definition found for function "${name}"`);
				process.exit(1);
			}
			await deployFunction(definition);
		}
	}
	
	if (gateway && global.apiGateway) await updateGateway(global.apiGateway);
})();
