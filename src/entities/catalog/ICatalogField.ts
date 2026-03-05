import { CatalogFieldValue, JsonField } from '../../types/common';

export default interface ICatalogField {
	example: JsonField;
	inputField: string;
	getValue(): Promise<CatalogFieldValue>;
	toJSON(): Promise<JsonField>;
}
