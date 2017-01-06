const Locator = require('../locator.js');
const XLSX = require('xlsx');
const ReadExcel = require(Locator.servicesPath.readExcel);

class WriteExcel extends ReadExcel {
	constructor() {
		super();
	}

	writeFile(location) {
		XLSX.writeFile(this.workbook, location);
	}

	writeToCell(sheet, locationObj, content) {
		sheet[locationObj.c + (locationObj.r + 1)] = content;
	}

	writeMerges(sheet) {
		let result = [];
		if(sheet['!merges']){
			sheet['!merges'].forEach((ele) => {
				var x = JSON.parse(JSON.stringify(ele));
				x.s.c = 1;
				x.e.c = 1;

				result.push(x);
			});
			sheet['!merges'] = sheet['!merges'].concat(result);
		}
	}

	writeRef(sheet) {
		sheet['!ref'] = 'A1:B20';
	}

	getCellMapObj(type, content) {
		return {
			t: type,
			v: content,
			r: '<t>'+ content +'</t>',
			h: content,
			w: content
		}
	}
}


let a = new WriteExcel();
a.readAsFile('sample.xlsx');
let sheet = a.getSheet(0);
let mergesArr = a.getSheetMerges(sheet);
let locArr = a.getCellLocationArr(mergesArr);

a.writeMerges(sheet);

locArr.forEach(function (ele) {
	let val = a.getCellVal(sheet, ele.tc);

	if(val){
		let cellObj = a.getCellMapObj('s', val);
		a.writeToCell(sheet, ele.bc, cellObj);
	}
});
console.log(sheet);


a.writeFile('sample.xlsx');
