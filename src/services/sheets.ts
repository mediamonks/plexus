import { google } from 'googleapis';
import authenticate from './auth';
import drive from './drive';
import workspace from './workspace';
import CustomError from '../entities/error-handling/CustomError';
import { SpreadSheet } from '../types/common';

const TAB_NAME = 'Sheet1';

export default async () => {
	const auth = await authenticate();
	const sheets = google.sheets({ version: 'v4', auth });
	const driveService = await drive();
	
	async function getRowCount(spreadsheetId) {
		await workspace.quotaDelay(workspace.SERVICE.SHEETS);
		
		const res = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range: `${TAB_NAME}!A:A`,
			majorDimension: 'ROWS',
		});
		
		return res.data.values?.length ?? 0;
	}
	
	async function sort(spreadsheetId, columnIndex) {
		const requests = [
			{
				sortRange: {
					range: {
						sheetId: 0,
						startRowIndex: 1,
						startColumnIndex: 0,
					},
					sortSpecs: [
						{
							dimensionIndex: columnIndex,
							sortOrder: 'DESCENDING',
						},
					],
				},
			},
		];
		
		await workspace.quotaDelay(workspace.SERVICE.SHEETS, workspace.OPERATION.WRITE);
		
		await sheets.spreadsheets.batchUpdate({
			spreadsheetId,
			requestBody: { requests },
		});
	}
	
	async function writeData(spreadsheetId, rowNumber, rowData) {
		await workspace.quotaDelay(workspace.SERVICE.SHEETS, workspace.OPERATION.WRITE);
		
		await sheets.spreadsheets.values.update({
			spreadsheetId,
			range: `${TAB_NAME}!B${rowNumber}`,
			valueInputOption: 'RAW',
			requestBody: {
				values: [rowData],
			},
		});
	}
	
	async function getData(spreadsheetId: string): Promise<SpreadSheet> {
		try {
			await workspace.quotaDelay(workspace.SERVICE.SHEETS);
			
			const spreadsheet = await sheets.spreadsheets.get({
				spreadsheetId,
			});
			
			const tabs = await Promise.all(spreadsheet.data.sheets.map(async sheetInfo => {
				if (sheetInfo.properties.hidden) return;
				
				const { title } = sheetInfo.properties;
				
				await workspace.quotaDelay(workspace.SERVICE.SHEETS);
				
				const response = await sheets.spreadsheets.values.get({
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
	
	async function create(name, data, folderId) {
		try {
			const metadata = await driveService.createFile(name, folderId, 'application/vnd.google-apps.spreadsheet');
			
			if (!data || !data.length) {
				return metadata;
			}
			
			await workspace.quotaDelay(workspace.SERVICE.SHEETS, workspace.OPERATION.WRITE);
			
			await sheets.spreadsheets.values.update({
				spreadsheetId: metadata.id,
				range: `${TAB_NAME}!A1`,
				valueInputOption: 'USER_ENTERED',
				requestBody: {
					values: data
				}
			});
			
			return metadata;
		} catch (error) {
			throw new CustomError(`Failed to create spreadsheet "${name}": ${error.message}`);
		}
	}
	
	return {
		getData,
		create,
	};
};
