import ExcelJS from 'exceljs';
import { SpreadSheetData } from '../types/common';

async function getData(path: string): Promise<SpreadSheetData> {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.readFile(path);
	
	const sheets = [];
	
	workbook.eachSheet((worksheet) => {
		const rows: any[] = [];
		const headers: string[] = [];
		
		worksheet.eachRow((row, rowNumber) => {
			if (rowNumber === 1) {
				row.eachCell((cell) => {
					headers.push(cell.value?.toString() || '');
				});
			} else {
				const rowData: any = {};
				row.eachCell((cell, colNumber) => {
					const header = headers[colNumber - 1];
					if (header) {
						rowData[header] = cell.value;
					}
				});
				rows.push(rowData);
			}
		});
		
		sheets.push({ title: worksheet.name, rows });
	});
	
	return { sheets };
}

export default { getData };
