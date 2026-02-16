import Catalog from '../catalog/Catalog';
import { JsonObject } from '../../types/common';

export default interface IAgent {
	prepare(catalog: Catalog): Promise<void>;
	invoke(): Promise<JsonObject>;
}
