const XLSX = require('xlsx');

function ReadExcel() {

	this.setWorkBook = function (wb) {
		this.workbook = wb;		
	}

	this.getWorkBook = function () {
		return this.workbook;
	}

	this.readAsBinary = function () {
	}

	this.readAsFile = function (filePath) {
		this.workbook = XLSX.readFile(filePath);
		return true;
	}

	this.getSheet = function (n) {
		if(~this.workbook.SheetNames){
			let nSheetName = this.workbook.SheetNames[n];
			return this.workbook.Sheets[nSheetName];
		}
		else{
			throw Error('No Sheets found');
		}
	}

	this.getSheetMerges = function (sheet) {
		if(sheet['!merges']){
			return sheet['!merges'];
		}
		else{
			return [];
		}
	}

	this.getCellLocationArr = function (mergesArr){
		let locationArr = [];
		let row = 0;
		
		debugger;

		for(i = 0; i < 20; i++){
			let obj = {};
			obj.tc = {};
			obj.bc = {};

			let merge = mergesArr.find((ele) => {
				return ele.s.r === i;
			});

			if(merge){
				row = merge.s.r;
				i = merge.e.r;
			}else{
				row = i;
			}

			obj.tc = {c: 'A', r: row};
			obj.bc = {c: 'B', r: row};

			locationArr.push(obj);
		}
		return locationArr;
	}

	this.getCellVal = function (sheet, locationObj) {
		if(sheet[locationObj.c + (locationObj.r + 1)]){
			return sheet[locationObj.c + (locationObj.r + 1)].w;
		}
		return false;
	}
}

module.exports = ReadExcel;


/*let a = new ReadExcel();
a.readAsFile('sample.xlsx');
let sheet = a.getSheet(0);
let merges = a.getSheetMerges(sheet);
let itor = a.getCellLocationArr(merges);
console.log(a.getCellVal(sheet, itor[0].tc));*/