const Excel = require('exceljs')

var workbook = new Excel.Workbook();

workbook.creator = 'Me';
workbook.lastModifiedBy = 'Her';
workbook.created = new Date();
workbook.modified = new Date();
workbook.lastPrinted = new Date();


workbook.views = [{
	// statring from very left
	x: 0,
	y: 0,
	width: 10000,
	height: 20000,
	firstSheet: 0,

	// active first tab
	activeTab: 0,
	visibility: 'visible'
}];

var sheet = workbook.addWorksheet('Sanitization Document');
var sheet1 = workbook.addWorksheet('Ssanitization Document');

sheet.columns = [
	{ header: 'Test Suite', key: 'ts_col', width: 40},
	{ header: 'Test Case Name', key: 'tc_col', width: 40},
	{ header: 'Sanitization Steps', key: 'sanit_steps_col', width: 100},
];


var rowValues = [];
rowValues[1] = 4;
rowValues[5] = 'Kyle';
rowValues[9] = new Date();

rowValues.height = 42.5;

let row1 = sheet.addRow(rowValues);
row1.height = 50;
sheet.addRow(rowValues);

	workbook.xlsx.writeFile("test.xlsx")
	.then(function() {
		console.log("Done")
	})
	.catch(function (error) {
		console.error(error);
	});
