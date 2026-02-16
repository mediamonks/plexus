import { CatalogFieldValue, JsonField } from '../../types/common';

export default interface ICatalogField {
	example: JsonField;
	getValue(): Promise<CatalogFieldValue>;
	toJSON(): Promise<JsonField>;
}
