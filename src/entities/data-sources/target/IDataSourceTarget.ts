export default interface DataSourceTarget {
	read(): Promise<any[]>;
	
	ingest(): Promise<void>;
	
	query(): Promise<any>;
}
