import ITargetDataSourceBehavior from '../target/ITargetDataSourceBehavior';
import { JsonObject } from '../../../types/common';

export default interface IDataTypeDataSourceBehavior {
  targetBehaviorClass: new () => ITargetDataSourceBehavior;

	ingest(): Promise<void>;
	
  getIngestedData(): Promise<string | AsyncGenerator<JsonObject> | void>;
}
