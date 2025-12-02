import { sheets_v4, google } from 'googleapis';
import GoogleAuthClient from './GoogleAuthClient';
import GoogleWorkspace from './GoogleWorkspace';
import CustomError from '../../entities/error-handling/CustomError';
import { SpreadSheetData } from '../../types/common';

export default class GoogleSheets {
	private static _client: sheets_v4.Sheets;
	
	public static async getData(spreadsheetId: string): Promise<SpreadSheetData> {
		try {
			const client = await this.getClient();
			
			await GoogleWorkspace.quotaDelay(GoogleWorkspace.SERVICE.SHEETS);
			
			const spreadsheet = await client.spreadsheets.get({
				spreadsheetId,
			});
			
			const tabs = await Promise.all(spreadsheet.data.sheets.map(async sheetInfo => {
				if (sheetInfo.properties.hidden) return;
				
				const { title } = sheetInfo.properties;
				
				await GoogleWorkspace.quotaDelay(GoogleWorkspace.SERVICE.SHEETS);
				
				const response = await client.spreadsheets.values.get({
					spreadsheetId: spreadsheetId,
					range: title,
					valueRenderOption: 'UNFORMATTED_VALUE',
					dateTimeRenderOption: 'SERIAL_NUMBER',
				});
				
				return {
					title,
					rows: response.data.values || [],
				};
			}));
			
			return { sheets: tabs.filter(Boolean) };
		} catch (error) {
			throw new CustomError(`Failed to get spreadsheet data for ID "${spreadsheetId}": ${error.message}`);
		}
	}
	
	private static async getClient(): Promise<sheets_v4.Sheets> {
		if (this._client) return this._client;
		const auth = await GoogleAuthClient.get();
		return this._client = google.sheets({ version: 'v4', auth });
	}
};
