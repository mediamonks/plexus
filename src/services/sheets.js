const { google } = require('googleapis');
const workspace = require('./workspace');

const TOTAL_SCORE_COLUMN_INDEX = 3;
const TAB_NAME = 'Sheet1';
const COLUMN_COUNT = 14;

module.exports = auth => {
	const sheets = google.sheets({ version: 'v4', auth });
	const drive = require('./drive')(auth);
	
	async function getRowCount(spreadsheetId) {
		await workspace.quotaDelay(workspace.SERVICE.SHEETS);
		
		const res = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range: `${TAB_NAME}!A:A`,
			majorDimension: 'ROWS',
		});
		
		return res.data.values?.length ?? 0;
	}
	
	async function insertRowAfter(spreadsheetId, rowNumber, rowData) {
		const requests = [
			{
				insertDimension: {
					range: {
						sheetId: 0,
						dimension: 'ROWS',
						startIndex: rowNumber,
						endIndex: rowNumber + 1,
					},
					// inheritFromBefore: true,
				},
			},
			{
				copyPaste: {
					source: {
						sheetId: 0,
						startRowIndex: rowNumber - 1,
						endRowIndex: rowNumber,
						startColumnIndex: 0,
						endColumnIndex: COLUMN_COUNT,
					},
					destination: {
						sheetId: 0,
						startRowIndex: rowNumber,
						endRowIndex: rowNumber + 1,
						startColumnIndex: 0,
						endColumnIndex: COLUMN_COUNT,
					},
					pasteType: 'PASTE_NORMAL',
				},
			},
			{
				updateCells: {
					range: {
						sheetId: 0,
						startRowIndex: rowNumber,
						endRowIndex: rowNumber + 1,
						startColumnIndex: 1,
						endColumnIndex: 1 + rowData.length
					},
					rows: [{
						values: rowData.map(value => ({ userEnteredValue:
								typeof value === 'number'
									? { numberValue: value }
									: { stringValue: String(value) }
						}))
					}],
					fields: 'userEnteredValue'
				}
			},
			{
				sortRange: {
					range: {
						sheetId: 0,
						startRowIndex: 1,
						startColumnIndex: 0,
					},
					sortSpecs: [
						{
							dimensionIndex: TOTAL_SCORE_COLUMN_INDEX,
							sortOrder: 'DESCENDING',
						},
					],
				},
			},
		];
		
		await workspace.quotaDelay(workspace.SERVICE.SHEETS, workspace.OPERATION.WRITE);
		
		await sheets.spreadsheets.batchUpdate({
			spreadsheetId,
			resource: { requests },
		});
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
			resource: { requests },
		});
	}
	
	async function writeData(spreadsheetId, rowNumber, rowData) {
		await workspace.quotaDelay(workspace.SERVICE.SHEETS, workspace.OPERATION.WRITE);
		
		await sheets.spreadsheets.values.update({
			spreadsheetId,
			range: `${TAB_NAME}!B${rowNumber}`,
			valueInputOption: 'RAW',
			resource: {
				values: [rowData],
			},
		});
	}
	
	async function writeToSheet(spreadsheetId, data) {
		const rowCount = await getRowCount(spreadsheetId);
		
		await insertRowAfter(spreadsheetId, rowCount, data);
		
		// await writeData(spreadsheetId, rowCount, data);
		
		// await sort(spreadsheetId, TOTAL_SCORE_COLUMN_INDEX);
	}
	
	async function getData(spreadsheetId) {
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
			throw new Error(`Failed to get spreadsheet data for ID "${spreadsheetId}": ${error.message}`);
		}
	}
	
	async function create(name, data, folderId) {
		try {
			const metadata = await drive.createFile(name, folderId, 'application/vnd.google-apps.spreadsheet');
			
			if (!data || !data.length) {
				return metadata;
			}
			
			await workspace.quotaDelay(workspace.SERVICE.SHEETS, workspace.OPERATION.WRITE);
			
			await sheets.spreadsheets.values.update({
				spreadsheetId: metadata.id,
				range: `${TAB_NAME}!A1`,
				valueInputOption: 'USER_ENTERED',
				resource: {
					values: data
				}
			});
			
			return metadata;
		} catch (error) {
			throw new Error(`Failed to create spreadsheet "${name}": ${error.message}`);
		}
	}
	
	return {
		getData,
		writeToSheet,
		create,
	};
};
