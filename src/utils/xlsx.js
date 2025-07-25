const XLSX = require('xlsx');

async function getData(path) {
	const workbook = XLSX.readFile(path);
	
	const sheets = [];
	
	for (const sheetName of workbook.SheetNames) {
		const worksheet = workbook.Sheets[sheetName];
		sheets.push({ name: sheetName, data: XLSX.utils.sheet_to_json(worksheet) });
	}
	
	return { sheets }
}

module.exports = { getData };
