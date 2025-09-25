import TargetDataSourceBehavior from './TargetDataSourceBehavior';

export default class RawTextTargetDataSourceBehavior extends TargetDataSourceBehavior {
	public async read(): Promise<string> {
		const contents = await this.dataSource.getContents();
		return contents.join('\n\n');
	}
}
