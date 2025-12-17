import path from 'path';
import Docker from 'dockerode';
import ILLMPlatform, { QueryOptions } from './ILLMPlatform';
import Config from '../../core/Config';
import Debug from '../../core/Debug';
import History from '../../core/History';
import CustomError from '../../entities/error-handling/CustomError';
import { staticImplements } from '../../types/common';
import DataSourceItem from '../../entities/data-sources/origin/DataSourceItem';
import OpenAI from 'openai';
import UnsupportedError from '../../entities/error-handling/UnsupportedError';
import ILocalLLMPlatformImage from './huggingface/ILocalLLMPlatformImage';
import LocalLLMPlatformImageTGI from './huggingface/LocalLLMPlatformImageTGI';
import LocalLLMPlatformImageLlamaCpp from './huggingface/LocalLLMPlatformImageLlamaCpp';

interface DockerPullEvent {
	id?: string;
	status: string;
	progress?: string;
	progressDetail?: { current?: number; total?: number };
}

const PORT = 8080;

const IMAGES: Record<string, ILocalLLMPlatformImage> = {
	tgi: new LocalLLMPlatformImageTGI(),
	llamacpp: new LocalLLMPlatformImageLlamaCpp(),
};

const docker = new Docker();

@staticImplements<ILLMPlatform>()
export default class LocalLLMPlatform {
	public static readonly supportedMimeTypes: Set<string> = new Set([
		'application/json',
		'application/pdf',
		'image/gif',
		'image/jpeg',
		'image/png',
		'image/webp',
		'text/plain',
	]);
	
	public static readonly Configuration: {
		model: string;
		image: 'tgi' | 'llamacpp';
		contextSize?: number;
		visionProjector?: string;
	};
	
	private static _container: Docker.Container;
	
	public static async generateQueryEmbeddings(text: string, model?: string): Promise<number[]> {
		throw new CustomError('Not implemented');
	}
	
	public static async generateDocumentEmbeddings(text: string, model?: string): Promise<number[]> {
		throw new CustomError('Not implemented');
	}
	
	public static get embeddingModel(): string {
		throw new CustomError('Not implemented');
	}
	
	public static async query(query: string, { instructions, history, maxTokens, temperature, files }: QueryOptions): Promise<string> {
		const messages = await this.createMessages(query, instructions, history, files);
		
		Debug.dump('LocalLLMPlatform messages', messages);
		
		const client = await this.getClient();
		
		const result = await client.chat.completions.create({
			model: 'local',
			messages,
			max_completion_tokens: maxTokens,
			temperature,
		});
		
		return result.choices[0].message.content ?? '';
	}
	
	private static async createMessages(query: string, instructions: string, history: History, files: DataSourceItem<string, unknown>[]): Promise<OpenAI.Chat.Completions.ChatCompletionMessageParam[]> {
		const userContent = await this.image.createUserContent(query, files);
		
		return [
			{ role: 'system', content: instructions },
			...history.toOpenAi(),
			{ role: 'user', content: userContent },
		];
	}
	
	public static async cleanUp() {
		if (!this._container) return;
		await this._container.stop();
	}
	
	public static get configuration(): typeof LocalLLMPlatform.Configuration {
		return Config.get('local-llm');
	}
	
	public static get contextSize(): number {
		return this.configuration.contextSize ?? 32768;
	}
	
	private static get endpointUrl(): string {
		return `http://localhost:${PORT}`;
	}
	
	private static _client: OpenAI;
	
	private static async getClient(): Promise<OpenAI> {
		if (this._client) return this._client;
		
		try {
			await docker.ping();
		} catch {
			throw new CustomError('Docker service not running', 500);
		}
		
		await this.startContainer();
		
		return this._client = new OpenAI({
			baseURL: `${this.endpointUrl}/v1`,
			apiKey: 'not-needed',
		});
	}
	
	private static get image(): ILocalLLMPlatformImage {
		return IMAGES[this.configuration.image];
	}
	
	private static get containerName(): string {
		return `plexus-${this.configuration.image}`;
	}
	
	private static async waitForHealthCheck() {
		Debug.log('Waiting for model to load', 'LocalLLMPlatform');
		
		const url = `${this.endpointUrl}/${this.image.healthEndpoint}`;
		const interval = 2000;
		let ok = false;
		
		while (!ok) {
			try {
				({ ok } = await fetch(url));
			} catch (e) {}
			
			await new Promise(resolve => setTimeout(resolve, interval));
		}
	}
	
	private static async getDockerImage(): Promise<string> {
		const { imageName } = this.image;
		const image = docker.getImage(imageName);
		
		try {
			await image.inspect();
			return imageName;
		} catch {
			return this.downloadImage();
		}
	}
	
	private static async downloadImage(): Promise<string> {
		const { imageName } = this.image;
		Debug.log(`Downloading ${imageName}`, 'LocalLLMPlatform');
		
		return new Promise((resolve, reject) => {
			docker.pull(imageName, (err: Error | null, stream: NodeJS.ReadableStream) => {
				if (err) return reject(err);
				
				const onFinished = (err: Error | null, output: DockerPullEvent[]) => {
					if (err) return reject(err);
					resolve(imageName);
				};
				
				docker.modem.followProgress(stream, onFinished, () => {});
			});
		});
	}
	
	private static async getContainer(): Promise<Docker.Container> {
		if (this._container) return this._container;
		
		const container = docker.getContainer(this.containerName);
		
		try {
			if (await this.containerConfigMatches(container)) {
				return this._container = container;
			}
			
			Debug.log('Container config changed, recreating', 'LocalLLMPlatform');
			await container.stop().catch(() => {});
			await container.remove();
		} catch {}
		
		return this._container = await this.createContainer();
	}
	
	private static async containerConfigMatches(container: Docker.Container): Promise<boolean> {
		const info = await container.inspect();
		const expected = this.getContainerOptions();
		
		const imageMatches = info.Config.Image === expected.Image;
		const envMatches = expected.Env!.every(e => info.Config.Env.includes(e));
		const cmdMatches = JSON.stringify(info.Config.Cmd) === JSON.stringify(expected.Cmd);
		const bindsMatch = JSON.stringify(info.HostConfig.Binds) === JSON.stringify(expected.HostConfig!.Binds);
		
		return imageMatches && envMatches && cmdMatches && bindsMatch;
	}
	
	private static getContainerOptions(): Docker.ContainerCreateOptions {
		const localCacheDir = path.resolve(Config.get('tempPath'), 'hf-data');
		const { env, cmd } = this.image.getContainerConfig();
		
		return {
			Image: this.image.imageName,
			name: this.containerName,
			ExposedPorts: {
				'80/tcp': {}
			},
			Env: env,
			Cmd: cmd,
			HostConfig: {
				PortBindings: { '80/tcp': [{ HostPort: String(PORT), HostIp: '0.0.0.0' }] },
				Binds: [`${localCacheDir}:${this.image.cacheBindPath}`],
				DeviceRequests: [
					{
						Driver: '',
						Count: -1,
						DeviceIDs: [],
						Capabilities: [['gpu']]
					}
				],
				ShmSize: 1073741824,
			},
			Tty: true
		};
	}
	
	private static async createContainer(): Promise<Docker.Container> {
		Debug.log(`Creating ${this.containerName} Docker Container`, 'LocalLLMPlatform');
		await this.getDockerImage();
		return docker.createContainer(this.getContainerOptions());
	}
	
	private static async startContainer(): Promise<void> {
		const container = await this.getContainer();
		
		const info = await container.inspect();
		
		if (!info.State.Running) {
			Debug.log(`Starting ${this.containerName} Container`, 'LocalLLMPlatform');
			await container.start();
		}
		
		await this.waitForHealthCheck();
	}
	
	public static async createFileParts(files: DataSourceItem<string, unknown>[]): Promise<OpenAI.Chat.Completions.ChatCompletionContentPart[]> {
		const supportedImageTypes = new Set([...this.supportedMimeTypes].filter(type => type.startsWith('image/')));
		
		return Promise.all(files.map(async item => {
			if (item.mimeType === 'application/json') return {
				type: 'text' as const,
				text: await item.getTextContent(),
			};
			
			if (item.mimeType === 'application/pdf') return {
				type: 'text' as const,
				text: await item.toText(),
			};
			
			if (supportedImageTypes.has(item.mimeType)) return {
				type: 'image_url' as const,
				image_url: { url: await item.toDataUri() },
			};
			
			if (item.mimeType === 'text/plain') return {
				type: 'text' as const,
				text: await item.toText(),
			};
			
			throw new UnsupportedError('mime type', item.mimeType, Array.from(this.supportedMimeTypes));
		}));
	}
}
