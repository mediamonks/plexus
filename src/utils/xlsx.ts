import XLSX from 'xlsx';
import { SpreadSheet } from '../types/common';

async function getData(path: string): Promise<SpreadSheet> {
	const workbook = XLSX.readFile(path);
	
	const sheets = [];
	
	for (const sheetName of workbook.SheetNames) {
		const worksheet = workbook.Sheets[sheetName];
		sheets.push({ title: sheetName, rows: XLSX.utils.sheet_to_json(worksheet) });
	}
	
	return { sheets }
}

export default { getData };
