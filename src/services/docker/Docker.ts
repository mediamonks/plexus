import net from 'node:net';
import Dockerode from 'dockerode';
import Debug from '../../core/Debug';
import CustomError from '../../entities/error-handling/CustomError';
import hash from '../../utils/hash';

export type ContainerOptions = {
	image: string;
	ports: number[];
	binds: string[];
	env?: string[];
	cmd?: string[];
	gpu?: boolean;
	healthCheck: { port: number; path?: string; tcp?: boolean };
};

const HEALTHCHECK_MAX_ATTEMPTS = 60;

const dockerode = new Dockerode();

export default class Docker {
	public static async start(options: ContainerOptions): Promise<Record<number, number>> {
		try {
			await dockerode.ping();
		} catch {
			throw new CustomError('Docker service not running', 500);
		}
		
		const name = this.getName(options);
		let container = dockerode.getContainer(name);
		let info: Dockerode.ContainerInspectInfo;
		try {
			info = await container.inspect();
		} catch {
			container = await this.create(options);
			info = await container.inspect();
		}
		
		const ports = this.getPortMapping(info);
		
		if (!info.State.Running) {
			Debug.log(`Starting container "${name}"`, 'Docker');
			await container.start();
			
			const { port, path = '', tcp } = options.healthCheck;
			const hostPort = ports[port];
			try {
				if (tcp) {
					await this.healthyTcp(hostPort);
				} else {
					await this.healthyHttp(`http://localhost:${hostPort}/${path}`.replace(/\/+$/, ''));
				}
			} catch {
				throw new CustomError(`Container "${name}" failed to start within timeout`);
			}
		}
		
		return ports;
	}
	
	private static getPortMapping(info: Dockerode.ContainerInspectInfo): Record<number, number> {
		const ports: Record<number, number> = {};
		const bindings = info.HostConfig.PortBindings || {};
		
		for (const [containerPort, hostBindings] of Object.entries(bindings)) {
			const port = parseInt(containerPort);
			const hostPort = parseInt(hostBindings[0]?.HostPort);
			if (hostPort) ports[port] = hostPort;
		}
		
		return ports;
	}
	
	private static getName(options: ContainerOptions) {
		const name = options.image.split('/').pop().split(':')[0];
		return `plexus-${name}-${hash(JSON.stringify({ ...options, healthCheck: undefined }))}`;
	}
	
	private static async create(containerOptions: ContainerOptions): Promise<Dockerode.Container> {
		await this.downloadImage(containerOptions.image);
		
		const name = this.getName(containerOptions);
		const portBindings = await this.allocatePorts(containerOptions.ports);
		
		Debug.log(`Creating container ${name}`, 'Docker');
		
		const exposedPorts: Record<string, object> = {};
		for (const port of containerOptions.ports) {
			exposedPorts[`${port}/tcp`] = {};
		}
		
		const options = {
			name,
			Image: containerOptions.image,
			ExposedPorts: exposedPorts,
			Env: containerOptions.env,
			Cmd: containerOptions.cmd,
			HostConfig: {
				PortBindings: portBindings,
				Binds: containerOptions.binds,
				...(containerOptions.gpu && {
					DeviceRequests: [{ Driver: '', Count: -1, DeviceIDs: [], Capabilities: [['gpu']] }],
					ShmSize: 1073741824,
				}),
			},
			Tty: true,
		};
		
		return dockerode.createContainer(options);
	}
	
	private static async allocatePorts(containerPorts: number[]): Promise<Record<string, { HostPort: string; HostIp: string }[]>> {
		const bindings: Record<string, { HostPort: string; HostIp: string }[]> = {};
		
		for (const containerPort of containerPorts) {
			const hostPort = await this.findAvailablePort();
			bindings[`${containerPort}/tcp`] = [{ HostPort: String(hostPort), HostIp: '0.0.0.0' }];
		}
		
		return bindings;
	}
	
	private static findAvailablePort(): Promise<number> {
		return new Promise((resolve, reject) => {
			const server = net.createServer();
			server.listen(0, '0.0.0.0', () => {
				const { port } = server.address() as net.AddressInfo;
				server.close(() => resolve(port));
			});
			server.on('error', reject);
		});
	}
	
	private static async downloadImage(imageName: string): Promise<void> {
		try {
			await dockerode.getImage(imageName).inspect();
			return;
		} catch {}
		
		Debug.log(`Downloading ${imageName}`, 'Docker');
		
		return new Promise((resolve, reject) => {
			dockerode.pull(imageName, (err: Error | null, stream: NodeJS.ReadableStream) => {
				if (err) return reject(err);
				dockerode.modem.followProgress(stream, (err: Error | null) => err ? reject(err) : resolve());
			});
		});
	}
	
	private static async healthyHttp(url: string): Promise<void> {
		for (let attempt = 0; attempt < HEALTHCHECK_MAX_ATTEMPTS; attempt++) {
			try {
				const response = await fetch(url);
				if (response.ok) return;
			} catch {}
			await new Promise(resolve => setTimeout(resolve, 2000));
		}
		throw new CustomError(`health check timeout for ${url}`);
	}
	
	private static async healthyTcp(port: number): Promise<void> {
		for (let attempt = 0; attempt < HEALTHCHECK_MAX_ATTEMPTS; attempt++) {
			try {
				await new Promise<void>((resolve, reject) => {
					const socket = net.createConnection(port, 'localhost', () => {
						socket.end();
						resolve();
					});
					socket.on('error', reject);
				});
				return;
			} catch {}
			await new Promise(resolve => setTimeout(resolve, 2000));
		}
		throw new CustomError(`health check timeout for port ${port}`);
	}
}
