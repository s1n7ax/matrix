if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbook = XLSX.readFile('a.xlsx');

//console.log(workbook);

console.log(workbook.Sheets.Sheet1)
workbook.Sheets['Sheet1']['A1'].v = 'newText';

XLSX.writeFile(workbook, 'a.xlsx');