export type JsonPrimitive = string | number | boolean | null ;
export type JsonArray = JsonField[];
export type JsonField = JsonPrimitive | JsonArray | JsonObject;
export type JsonObject = { [key: string]: JsonField };

export type ValueOf<T> = T[keyof T];

export type SpreadSheet = { sheets: { title: string; rows: any[] }[] };
