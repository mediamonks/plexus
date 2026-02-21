import { sheets_v4, google } from 'googleapis';
import GoogleAuthClient from './GoogleAuthClient';
import GoogleWorkspace from './GoogleWorkspace';
import CustomError from '../../entities/error-handling/CustomError';
import { SpreadSheetData, JsonPrimitive } from '../../types/common';

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
	
	/**
	 * Writes data to a Google Sheet
	 * @param spreadsheetId - The ID of the spreadsheet
	 * @param range - A1 notation range (e.g., 'Sheet1!A1:C10', 'Sheet1!A1', or just 'Sheet1')
	 * @param values - 2D array of values to write
	 */
	public static async setData(spreadsheetId: string, range: string, values: JsonPrimitive[][]): Promise<void> {
		try {
			const client = await this.getClient();
			
			await GoogleWorkspace.quotaDelay(GoogleWorkspace.SERVICE.SHEETS);
			
			await client.spreadsheets.values.update({
				spreadsheetId,
				range,
				valueInputOption: 'USER_ENTERED',
				requestBody: {
					values,
				},
			});
		} catch (error) {
			throw new CustomError(`Failed to write data to spreadsheet "${spreadsheetId}" range "${range}": ${error.message}`);
		}
	}
	
	private static async getClient(): Promise<sheets_v4.Sheets> {
		if (this._client) return this._client;
		const auth = await GoogleAuthClient.get();
		return this._client = google.sheets({ version: 'v4', auth });
	}
};
