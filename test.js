/*const excelbuilder = require('msexcel-builder');
var workbook = excelbuilder.createWorkbook('./', 'sample.xlsx');


var sheet1 = workbook.createSheet('test', 2, 2);

sheet1.merge({col:1,row:1},{col:1,row:5});
sheet1.merge({col:1,row:6},{col:1,row:10});

sheet1.set(1, 1, 'I am title');
sheet1.set(1, 2, 'test');

sheet1.set(2, 1, 'Next Title');
console.log(excelbuilder)
console.log(sheet1.merges);

workbook.save(function(ok){
	if (!ok) 
	  workbook.cancel();
	else
	  console.log('congratulations, your workbook created');
});
*/



XLSX = require('xlsx');
var workbook = XLSX.readFile('sample.xlsx');
debugger;
console.log(workbook);







/*$("form").submit(function(e){
	e.preventDefault();
    var form = $(this);
	var data = form.serialize();
    $.ajax({ 
         url   : form.attr('action'),
         type  : form.attr('method'),
         data  : , // data to be submitted
         success: function(response){
            alert(response); // do what you like with the response
         }
    });
    return false;
 }); 
"projectname=&projectduration=01%2F05%2F2017+-+01%2F05%2F2017&domain=Select+...&leads=Dushantha+Pradeep+-+(8000193)&leads=kasun+Ratnayake+-+(8000194)&releasename=&releasedate=" 
*/



/*




let a = [ { s: { c: 0, r: 0 }, e: { c: 0, r: 2 } },
  { s: { c: 0, r: 3 }, e: { c: 0, r: 5 } },
  { s: { c: 1, r: 3 }, e: { c: 1, r: 5 } } ]


function* cellIterator(mergesArr){
		let obj = {};
		obj.tc = {};
		obj.bc = {};

		let row = 0;

		for(let i = 0; i < 25000; i++){

			let merge = mergesArr.find((ele) => {
				return ele.s.r === i;
			});

			if(merge){
				row = merge.s.r;
				i = merge.e.r;
			}
			else{
				row = i;
			}

			obj.tc = {c: 0, r: row};
			obj.bc = {c: 1, r: row};

			yield obj;
		}
	}

let x = cellIterator(a)

console.log(x.next());
console.log(x.next());
console.log(x.next());
console.log(x.next());
console.log(x.next());
console.log(x.next());



*/