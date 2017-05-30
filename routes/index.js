const Locator = require('../locator');
const Path = require('path');
const os = require('os');
const FS = require('fs');
const http = require('http');
const express = require('express');
const Nano = require('nano');
const JsonFile = require('jsonfile');
const Excel = require('exceljs')


const NO_SPACE_REGEX = new RegExp(/\S/);
const STARTS_WITH_CALL_REGEX = new RegExp(/^call/, 'i');
//const multer  = require('multer');
//const WriteExcel = require(Locator.servicesPath.writeExcel);
const router = express.Router();
const Service =  require(Locator.servicesPath.services);



let dbConf = JsonFile.readFileSync(Locator.configurationPath.database_conf);
let connectionQuery = `http://${dbConf.username}:${dbConf.password}@${dbConf.host}:${dbConf.port}`;


/**
 * PROPERTIES
 */
let service = new Service(undefined, false);
let services = new Object();


/**
 * Interface
 */
let serviceProvider = function () {
	let removeValues = new RegExp('^_','g');
    remList = [];

	service.getAllProjects(function (error, body) {
		if(error){
            console.error(error);
        }else{
            body.forEach(function (val, index) {
                if(/^_/.test(val)) {
                    remList.push(index);
                }
            });

            for(x = remList.length - 1; x >= 0; x--){
                body.splice(remList[x], 1);
            }
        }

        console.log('\n*********** These are the projects ***********');
		console.log(body);

        body.forEach(function (val) {
			services[val] = new Service(val, true);
		});

		console.log('\n*********** Service Providers : Ready! ***********')
	});
};

let getResMap = function (status, val, error) {
    return {
        status: status,
        val: val,
        error: error
    }
};

let addLinkToItem = function (item, val) {
    item.links !== undefined ?
        item.links.push(val) :
        (item.links = new Array()) & item.links.push(val)

    return item;
};

let makeIterator = function (array){
    var nextIndex = 0;

    return {
       next: function(){
           return nextIndex < array.length ?
               {value: array[nextIndex++], done: false} :
               {done: true};
       }
    }
};

let getCalledComponents = function (content) {

    let calledComponents = [];

    //Reading statements line by line
    for(let i = 0, list = content.split('\n'), len = list.length;
        i < len; i++){

        //Removing spaces in the line start and line end
        list[i].replace(/^\s+|\s+$/g, '');

        //Ignore lines with spaces
        if(NO_SPACE_REGEX.test(list[i])){

            //Consider lines starts with a call command
            if(STARTS_WITH_CALL_REGEX.test(list[i])){
                try{
                    calledComponents.push(getIdFromCallStatement(list[i]));
                }catch(err){
					throw err;
                }
            }
        }
    }

	return calledComponents;
}


let getIdFromCallStatement = function(statement){
        let arr = statement.split(/\s/g);

        if(arr.length < 2){
            let error = new Error();
            error.name = 'NoSpaceAfterCall';
            error.message = 'Please follow the standard syntax to call a component. Use a space to seperate <command> and <library.component>';
            throw error;
        }

        if(!NO_SPACE_REGEX.test(arr[1])){
            let error = new Error();
            error.name = 'NoValueAfterCall';
            error.message = 'Please use library and component name to specify the component should be called after Call command. Use a dot(.) to seperate library and component. call <library.component>';
            throw error;
        }

        let path = arr[1].split('.');

        if(path.length < 2){
            let error = new Error();
            error.name = 'NoComponentAfterCall';
            error.message = 'Please use library and component name to specify the component should be called after Call command. Use a dot(.) to seperate library and component. call <library.component>';
            throw error;
        }

        if(path.length > 2){
            let error = new Error();
            error.name = 'InvalideNumberOfArgumentsAfterCall';
            error.message = 'Please use only library and component name to specify the component should be called after Call command. Use a dot(.) to seperate library and component. call <library.component>';
            throw error;
        }

        return path[1];
    }


serviceProvider();

router.post('/getSanitizationStepsByTemplate', function(req, res, next){
    let uploadedFilePath = null;

    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            console.log(req.body);
            callback(null, Locator.temp.temp);
        },
        filename: function (req, file, callback) {
            console.log(req.body);
            uploadedFilePath = file.fieldname + '-' + Date.now() + '.xlsx';
            callback(null, uploadedFilePath);
        }
    });

    var upload = multer({ storage : storage}).single('file');


    upload(req, res, function(err) {

        console.log(req.body.projectName);

        if(err) {
            return res.end("Error uploading file");
        }

        // let projectService = services[req.body.projectName];
        let projectService = services[req.body.projectName];

        try{
            projectService.getAllTCsAndBCs(function(tc, bc) {
                let notMatched = [];
                let ws = new WriteExcel();

                ws.readAsFile(Path.join(Locator.temp.temp, uploadedFilePath));
                let sheet = ws.getSheet(0);
                let mergesArr = ws.getSheetMerges(sheet);
                let locArr = ws.getCellLocationArr(mergesArr);

                ws.writeMerges(sheet);

                locArr.forEach(function (loc) {
                    let val = ws.getCellVal(sheet, loc.tc);

                    if(val){

                        let tcobj = tc.find(function (ele) {
                            return val == ele._id;
                        });

                        if(tcobj){
                            if(tcobj.content){
                                let calledCMP = getCalledComponents(tcobj.content);

                                container = '';
                                calledCMP.forEach(function(ele) {
                                    let cmp = bc.find(function (ele2) {
                                        return ele2._id === ele;
                                    });

                                    if(!cmp){
                                        cmp = {};
                                        cmp.content = 'Error: component not found';
                                    }
                                    if(!cmp.content){
                                        cmp.content = '';
                                    }

                                    //adding empty spaces
                                    let splitedContent = cmp.content.split('\n');
                                    let spacedContent = '';
                                    splitedContent.forEach((statement) => {
                                        spacedContent += '    ' + statement + '\r\n';
                                    });

                                    container += `************* ${ele} *************\n${spacedContent}\n\n`
                                });

                                let cellObj = ws.getCellMapObj('s', container);
                                ws.writeToCell(sheet, loc.bc, cellObj);
                            }
                        }else{
                            notMatched.push(val);
                        }
                    }
                });

                ws.writeFile(Path.join(Locator.temp.temp, uploadedFilePath));
                res.send(uploadedFilePath);


                 setTimeout(function () {
                    FS.unlinkSync(Path.join(Locator.temp.temp, uploadedFilePath));
                }, 10000);


            });
        }catch(error){
            dbErrorLogger('error', error);
        }
    });
});

router.get('/getSanitizationSteps', function (req, res, next){
	let projectName = req.query['projectName'];

	if(!projectName) {
		res.send(getResMap(false, null, "Select a project before download sanitize steps document"));
		return 0;
	}


	// excel file will goes in the temp folder
	let tempFolder = Locator.temp.temp;

	// format date string
	let date = new Date();
	let GMTString = date.toGMTString()

	GMTString = GMTString.replace(/\:/g, '-');

	let fileName = 'Sanitize Document '+ GMTString + '.xlsx';

	// full file path in the temp folder
	let targetFilePathPath = Path.join(tempFolder, fileName);


	// creating the excel file
	let workbook = new Excel.Workbook();

	workbook.creator = 'Matrix Creater';
	workbook.lastModifiedBy = 'Matrix Creater';
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
		activeTab: 1,
		visibility: 'visible'
	}];

	let sheet1 = workbook.addWorksheet('Sanitization Document');
	sheet1.columns = [
		{ header: 'Test Suite', key: 'ts_col', width: 40},
		{ header: 'Test Case Name', key: 'tc_col', width: 40},
		{ header: 'Sanitization Steps', key: 'sanit_steps_col', width: 100},
	];





	// getting all project details
	let _testSuiteList = [];
	let _testCaseList = [];
	let _componentList = [];

	let projectService = services[projectName];

	/*
	 Test Suites
	 */
	projectService.getAllTestsuiteDocs(undefined, function(error, body){
		if(error) res.send(getResMap(false, null, error));
		else{
			_testSuiteList = body.rows;
			console.log(_testSuiteList);

			/*
			 Test Cases
			 */
			projectService.getAllTestCaseDocs(undefined, function (error, body) {
				if(error) res.send(getResMap(false, null, error));
				else{
					_testCaseList = body.rows;
					console.log(_testCaseList);

					/*
					 conponents
					 */
					projectService.getAllComponentDocs(undefined, function (error, body){
						if(error) res.send(getResMap(false, null, error));
						else{
							_componentList = body.rows;
							console.log(_componentList);

							/*
							 Mapping to excell
							 */

							// All TestSutes
							_testSuiteList.forEach(function (testSuite) {

								// If There are links
								if(testSuite.value.links){

									// TestSute's TestCases
									testSuite.value.links.forEach(function (testCaseName) {

										// Find the TestCase name in the TestCase List
										let _testCase = _testCaseList.find(function (ele) {
											return ele.id === testCaseName;
										});

										// If testcase is not found, send error to user
										let errorMsg = "Error while creating excel file\n";
										errorMsg += "In TestSuite: "+ testSuite.id +", linked testcase: "+ testCaseName +" not found";
										errorMsg += "in the database testcase list\n";
										errorMsg += "contact your sys admin to solve the problem";

										if(!_testCase) {
											res.send(
												getResMap(false, null, errorMsg)
											);
											return 0;
										}

										let componentContentMapArray = [];


										// get the called components from the testcase content
										let _testcaseCalledComponentList = getCalledComponents(_testCase.value.content ? _testCase.value.content : "");

										// for each testcase -> called components
										_testcaseCalledComponentList.forEach(function (component) {

											// find testcase -> called component in database component list
											let _component = _componentList.find(function (ele) {
												return ele.id === component;
											});

											// If testcase is not found, send error to user
											let errorMsg = "Error while creating excel file\n";
											errorMsg += "In TestCase: "+ testCaseName +", called component: "+ component +" not found";
											errorMsg += "in the database compoentn list\n";
											errorMsg += "contact your sys admin to solve the problem";

											if(!_testCase) {
												res.send(
													getResMap(false, null, errorMsg)
												);
												return 0;
											}

											debugger;

											// adding that component and content into array
											componentContentMapArray.push({
												component: _component.id,
												content: _component.value.content? _component.value.content : "********* no content *********"
											});
										});


										// TestSuite.id, testCaseName, componentContentMapArray
										let excelRow = [];

										excelRow[0] = testSuite.id;
										excelRow[1] = testCaseName;
										excelRow[2] = "";

										if(!componentContentMapArray.length){
											excelRow[2] += "********* no components ********";
											excelRow[2] += "\r\n";

										}else{
											componentContentMapArray.forEach(function (ele, index) {
												debugger;
												excelRow[2] += (index+1) +": " + ele.component +"\r\n";

												let splitedContent = ele.content.split('\n');
												if(!splitedContent.length){
													excelRow[2] += "	********* no content ********\r\n";
												}else{
													splitedContent.forEach(function (ele, index) {
												        if(NO_SPACE_REGEX.test(ele)){
															excelRow[2] += "\t"+(index+1) + ". " + ele + '\r\n';
														}
													});
												}
												excelRow[2] += "\r\n";
											});
										}

										let addedRow = sheet1.addRow(excelRow);
										addedRow.height = 50;


									//TestSuite links attay end loop
									});

								//TestSuite links array validation end if
							}else{
								let excelRow = [];
								excelRow[0] = testSuite.id;
								excelRow[1] = "********* no testcases *********";
								excelRow[2] = "********* no components *********";

								let addedRow = sheet1.addRow(excelRow);
								addedRow.height = 50;
							}


							//TestSuite loop end
							});

							workbook.xlsx.writeFile(targetFilePathPath)
							.then(function() {
								res.download(targetFilePathPath);

								setTimeout(function () {
									try{
										FS.unlinkSync(targetFilePathPath)
									}catch(error){
										res.send(getResMap(false, null, error));
										console.log("Error while writing the sanitize excel file");
										console.error(error);
									}
								}, 1000*15)

							})
							.catch(function (error) {
								res.send(getResMap(false, null, error));
								console.log("Error while writing the sanitize excel file");
								console.error(error);
							});
						}
					});
				}
			});
		}
	});
});

router.get('/upload', function(req, res){
    res.sendFile(Locator.viewsPath.upload);
});

/*
router.get('/upload', function(req, res, next) {
    res.sendFile(Locator.viewsPath.upload);
});

router.post('/uploadFile', function(req, res, next) {
    console.log(req.body);
    res.send('hello');
});

*/


/**
 * Root
 */
router.get('/', function(req, res, next) {
    //res.sendFile(Locator.viewsPath.index);
    res.render(Locator.viewsPath.indexEJS, {
        sockethost: 'http://'+os.hostname()+':444'
    });
});


router.get('/reporter', function (req, res, next) {
    res.sendFile(Locator.viewsPath.reporter);
});

router.get('/getCurrentSanitizeMap', function(req, res, next) {

});


/**
 * Common
 */
router.post('/deleteItem', function (req, res, next) {
    let projectService = services[req.body.projectName];

    projectService.deleteDocByIdAndRev(req.body.val._id, req.body.val._rev, function (error, body) {
        if(error) {
            console.error(error);
            res.send(getResMap(false, null, error));
        }
        else {
            res.send(true, body, null);
        }
    })
});
router.post('/createItem', function (req, res, next) {
    let projectService = services[req.body.projectName];

    projectService.insertOrUpdateDoc(req.body.val, function (error, body) {
        if(error) {
            console.error(error);
            res.send({
                status: false,
                val: null,
                error: error
            });
        }
        else {
            res.send({
                status: true,
                val: body,
                error: null
            });
        }
    });
});

/**
 * USERS
 */
router.post('/getAllUsers', function (req, res, next) {
    services[req.body.projectName].getAllUsers(undefined, function (error, body) {
        if(error)
            res.send(getResMap(false, null, error));
        else{
            if(body.rows.length > 0)
                res.send(getResMap(true, body.rows[0].value, null));
            else
                res.send(getResMap(true, [], null));
        }
    });
});

router.post('/setResources', function (req, res, next) {
    services[req.body.projectName].insertOrUpdateDoc(req.body.userDoc, function (error, body) {
        if(error){
            res.send(getResMap(false, null, error));
        }else{
            res.send(getResMap(true, body, null));
        }
    });
});



/**
 * PROJECT
 */
router.post('/createProject', function (req, res, next) {

    console.log('creating project')

	service.createProject(req.body.projectName, function (error, body) {
		if(error) {
		    console.error(error);
			res.send(getResMap(false, null, error));
		}
		else {
			let design = { _id: '_design/Automate',
						  language: 'javascript',
						  views:{
						     getAllUsers: { map: 'function(doc) {doc.type === \'users\' && emit(doc._id, doc); }' },
						  	 getAllTestsuites: { map: 'function(doc) {doc.type === \'testsuite\' && emit(doc._id, doc); }' },
						     getAllTestCases: { map: 'function (doc) {if(doc.type == \'testcase\') {emit(doc._id, doc);}}' },
						     getAllComponents: { map: 'function(doc) { doc.type === \'component\' && emit(doc._id, doc) }' },
						     getAllLibraries: { map: 'function(doc) { doc.type === \'library\' && emit(doc._id, doc) }' },
						     getAll: { map: 'function(doc) { doc._id !== \'_design/Automate\' && emit(doc._id, doc) }' }
						  }
						};

			services[req.body.projectName] = new Service(req.body.projectName, true);
			services[req.body.projectName].insertOrUpdateDoc(design, function (error, body) {
				if(error) {
					res.send({
						'status': false,
						'data': null,
						'error': error
					});
				}
				else {
				    services[req.body.projectName].insertOrUpdateDoc(req.body.users, function (error, body) {
				        if(error)
				            res.send(false, null, error);
				        else
				            res.send(getResMap(true, body, null));
				    });
				}
			});
		}
	});
});

router.post('/deleteProject', function (req, res, next) {
	let services = new Services;

	services.deleteProject(req.body.values.projectName, function (error, body) {
		if(error) {
			req.send({
				'status': false,
				'val': null,
				'error': error
			});
		}
		else {
			req.send({
				'status': true,
				'val': body,
				'error': null
			});
		}
	})
});

router.post('/getAllProjects', function (req, res, next) {
    let removeValues = new RegExp('^_');
    let remList = [];

	service.getAllProjects(function (error, body) {
		if(error) {
			res.send({
				'status': false,
				'val': null,
				'error': error
			});
		}
		else {
			body.forEach(function (val, index) {
				if(/^_/.test(val)) {
                    remList.push(index);
				}
			});

            for(x = remList.length - 1; x >= 0; x--){
                body.splice(remList[x], 1);
            }

			res.send({
				'status': true,
				'val': body,
				'error': null
			});
		}
	});
});


/**
 * MODULE
 */
router.post('/createTestsuite', function (req, res, next) {
	let projectService = services[req.body.projectName];

	projectService.insertOrUpdateDoc(req.body.val, function (error, body) {

		if(error) {
			res.send({
				'status': false,
				'val': null,
				'error': error
			});
		}
		else {
			res.send({
				'status': true,
				'val': body,
				'error': null
			});
		}
	});
});

router.post('/getAllTestsuites', function (req, res, next) {
	let projectService = services[req.body.projectName];
	let result = new Array;

	projectService.getAllTestsuiteDocs(undefined, function (error, body) {
		if(error) {
			console.error(error)
			res.send({
				'status': false,
				'val': null,
				'error': error
			});
		}
		else {
			body.rows.forEach(function (data) {
				result.push(data.value);
			});

			res.send({
				'status': true,
				'val': result,
				'error': null
			});
		}
	});
});


/**
 * TESTCASE
 */
router.post('/createTestCase', function(req, res, next) {
	let projectService = services[req.body.projectName];

	projectService.insertOrUpdateDoc(req.body.val, function (error, body) {
	    let testcaseBody = body;

		if(error) {
			console.error(error);
			res.send(getResMap(false, null, error));
		}
		else {
		    req.body.parentNode = addLinkToItem(req.body.parentNode, body.id);
			projectService.insertOrUpdateDoc(req.body.parentNode, function (error, body) {
				if(error) {
				    console.error(error);
				    projectService.deleteDocByIdAndRev(testcaseBody._id, testcaseBody.rev, function (error, body) {
				        /**
                         * Error can be occurred because rev is changed.
                         * DB admin has to delete created component manually.
                         */
                        error ?
                            console.error('error 304') &
                            console.error(error) &
                            res.send(getResMap(false, null, 'error 304'))
                            :
                            res.send(getResMap(false, null, error))
				    });
				}
				else {
					res.send(getResMap(true, body, null));
				}
			});
		}
	});
});

router.post('/getAllTestCases', function (req, res, next) {
	let projectService = services[req.body.projectName];
	let result = new Array;

	projectService.getAllTestCaseDocs(undefined, function (error, body) {
		if(error) {
			res.send({
				'status': false,
				'data': null,
				'error': error
			});
		}
		else {
			body.rows.forEach(function (data) {
				result.push(data.value);
			});

			res.send({
				'status': true,
				'val': result,
				'error': null
			});
		}
	});
});

router.post('/updateTestcase', function (req, res, next) {
    let data = req.body;
    let projectService = services[data.projectName];

    projectService.insertOrUpdateDoc(data.val, function (error, body) {
        if(error) {
            console.log(error);
            res.send(getResMap(false, null, error));
        }
        else {
            res.send(getResMap(true, body, null))
        }
    });
});

router.post('/deleteTestcase', function (req, res, next) {
    let data = req.body;
    let projectService = services[data.projectName];

    projectService.deleteDocByIdAndRev(data.val._id, data.val._rev, function (error, body) {
        if(error) {
            console.error(error);
            res.send(getResMap(false, null, error));
        }
        else {
            projectService.insertOrUpdateDoc(data.parentNode, function (error, body) {
                if(error) {
                    console.error(error);
                    res.send(getResMap(false, null, error));
                }
                else {
                    res.send(getResMap(true, body, null));
                }
            })
        }
    })
});

router.post('/renameTestcase', function (req, res, next) {
    let projectService = services[req.body.projectName];

    projectService.copyDocById(req.body._id, req.body._newid, function (error, body) {
        if(error) {
            console.error(error);
            res.send(getResMap(false, null, error));
        }
        else {
            projectService.deleteDocById(req.body._id, function (error, body2) {
                if(error){
                    console.error(error);
                    res.send(getResMap(false, null, error));
                }
                else{
                    projectService.insertOrUpdateDoc(req.body.parentNode, function (error, body) {
                        if(error) {
                            console.error(error);
                            res.send(getResMap(false, null, error));
                        }
                        else {
                            res.send(getResMap(true, body, null))
                        }
                    });
                }
            });
        }
    });
});



/**
 * COMPONENT
 */
router.post('/createComponent', function (req, res, next) {
    let projectService = services[req.body.projectName];
    projectService.insertOrUpdateDoc(req.body.val, function (error, body) {
        let componentBody = body;

        if(error){
            console.error(error);
            res.send(getResMap(false, null, error));
        }
        else {
                req.body.parentNode = addLinkToItem(req.body.parentNode, componentBody.id);
                projectService.insertOrUpdateDoc(req.body.parentNode, function (error, body) {
                    if(error) {
                        console.error(error);
                        projectService.deleteDocByIdAndRev(componentBody.id, componentBody.rev, function (error) {
                            /**
                             * Error can be occurred because rev is changed.
                             * DB admin has to delete created component manually.
                             */
                            error ?
                                console.error('error 303') &
                                console.error(error) &
                                res.send(getResMap(false, null, 'error 303'))
                                :
                                res.send(getResMap(false, null, error))
                        });
                    }
                    else {
                        res.send(getResMap(true, body, null));
                    }
                });
        }



    });
});

router.post('/getAllComponents', function (req, res, next) {
	let projectService = services[req.body.projectName];
	let result = new Array;

	projectService.getAllComponentDocs(undefined, function (error, body) {
		if(error) {
			res.send({
				'status': false,
				'val': null,
				'error': error
			});
		}
		else {
			body.rows.forEach(function (data) {
				result.push(data.value);
			});

			res.send({
				'status': true,
				'val': result,
				'error': null
			});
		}
	});
});

router.post('/setComponent', function (req, res, next) {
	let projectService = services[req.body.projectName];

	projectService.insertOrUpdateDoc(req.body.val, function (error, body) {
		if(error) {
			console.error(error);
			res.send({
				'status': false,
				'val': null,
				'error': error
			});
		}
		else {
			res.send({
				'status': true,
				'val':body,
				'error': null
			});
		}
	})
});

router.post('/deleteComponent', function (req, res, next) {
    let projectService = services[req.body.projectName];

    projectService.deleteDocByIdAndRev(req.body.val._id, req.body.val._rev, function (error, body) {
        if(error) {
            console.error(error);

            res.send(getResMap(false, null, error));
        }
        else {
            projectService.insertOrUpdateDoc(req.body.parentNode, function (error, body) {
                if(error) {
                    console.error(error);
                    res.send(getResMap(false, null, error));
                }
                else {
                    res.send(getResMap(true, body, null));
                }
            })
        }
    });
});

router.post('/renameComponent', function (req, res, next) {
    let projectService = services[req.body.projectName];

    projectService.copyDocById(req.body._id, req.body._newid, function (error, body) {
        if(error) {
            console.error(error);
            res.send(getResMap(false, null, error));
        }
        else {
            projectService.deleteDocById(req.body._id, function (error, body2) {
                if(error){
                    console.error(error);
                    res.send(getResMap(false, null, error));
                }
                else{
                    projectService.insertOrUpdateDoc(req.body.parentNode, function (error, body) {
                        if(error) {
                            console.error(error);
                            res.send(getResMap(false, null, error));
                        }
                        else {
                            res.send(getResMap(true, body, null))
                        }

                    });
                }
            });
        }
    });
});


/**
 * LIBRARIES
 */
router.post('/getAllLibraries', function (req, res, next) {
    let projectService = services[req.body.projectName];
    let result = new Array();

    projectService.getAllLibraryDocs(undefined, function (error, body) {
        if(error){
            console.error(error);
            res.send(getResMap(false, null, error));
        }
        else {
        	body.rows.forEach(function (data) {
				result.push(data.value);
			});

            res.send(getResMap(true, result, null));
        }
    });
});

router.post('/deleteItemAndChildren', function (req, res, next) {
    let data = req.body;
    let projectService = services[data.projectName];

    projectService.deleteDocByIdAndRev(data.val._id, data.val._rev, function (error, body) {
        if(error) {
            console.error(error);
            res.send(getResMap(false, null, error));
        }
        else {
            if(data.val.links) {

                let i;
                for(i = 0; i < data.val.links.length; i++) {
                    projectService.deleteDocById(data.val.links[i], function (error, body) {
                        if(error) {
                            console.error('Error : 303');
                        }
                    });
                }
                if(i === data.val.links.length) {
                    res.send(getResMap(true, '', null));
                }
                else {
                    res.send(getResMap(false, null, 'Error : 303'));
                }
            }
            else {
                res.send(getResMap(true, body, null));
            }
        }
    });
});

router.post('/renameLibrary', function (req, res, next) {
    let projectService = services[req.body.projectName];

    projectService.copyDocById(req.body._id, req.body._newid, function (error, body) {
        if(error) {
            console.error(error)
            res.send(getResMap(false, null, error));
        }
        else {
            projectService.deleteDocById(req.body._id, function (error, body) {
                if(error) {
                        console.error(error);
                        res.send(getResMap(false, null, error));
                }
                else{
                    res.send(getResMap(true, body, null));
                }
            })
        }
    });
});


router.post('/renameTestsuite', function (req, res, next) {
    let projectService = services[req.body.projectName];

    projectService.copyDocById(req.body._id, req.body._newid, function (error, body) {
        if(error) {
            console.error(error)
            res.send(getResMap(false, null, error));
        }
        else {
            projectService.deleteDocById(req.body._id, function (error, body) {
                if(error) {
                        console.error(error);
                        res.send(getResMap(false, null, error));
                }
                else{
                    res.send(getResMap(true, body, null));
                }
            })
        }
    });
});


/**
 * OTHER
 */
router.post('/partialUpdate', function (req, res, next) {
    let projectService = services[req.body.projectName];

    projectService.selectDocById(req.body._id, function (error, body) {
        if(error)
            res.send(getResMap(false, null, error));
        else {
            let keys = Object.keys(req.body.val);
            keys.forEach((element) => {
                body[element] = req.body.val[element];
            });

            projectService.insertOrUpdateDoc(body, function (error, body) {
                if(error)
                    res.send(getResMap(false, null, error));
                else
                    res.send(getResMap(true, body, null));
            });
        }

    })
});






/**
 * New APIs
 */

/**
 * Loggers
 */
let dbErrorLogger = function (customMsg, error) {
	console.log('\n');
	console.log('****************************');
	console.error(customMsg);
	console.error(error.error);
	console.error(error.reason);
	console.log('\n');
	console.log('Request Details:');
	console.log(error.request.body);
	console.log(error.request.uri);
	console.log('\n');
	console.log('Date & Time:');
	console.log(error.headers.date);
	console.log('****************************');
}


/**
 * Delete
 * Deep Level 0 : delete doc
 * Deep Level 1 : delete doc and remove parent node link
 * Deep Level 2 : delete doc and remove all childs
 */

/**
 * deleteDeep0 : delete specified document only
 *
 * @Param {project, val:{_id, _rev}}
 * @Return undefined
 * @Res {status, val:{}, error:{}}
 */
let deleteDeep0 = function (req, res, next, callback) {
	let data = req.body;
	let dbService = new DBService(data.project);

	dbService.deleteDocByIdAndRev(data.val._id, data.val._rev, function (error, body) {
		let resData;
		if(error) {
			dbErrorLogger('Error at deleteDeep0', error);
			resData = getResMap(false, null, error);
		}
		else {
			resData = getResMap(true, body, null);
		}

		callback ?
			callback(resData):
			res.send(resData);
	});
}


/**
 * deleteDeep1 : delete specified document and parent's links
 *
 * @Param {project, parent:{}, val:{_id, _rev}}
 * @Return undefined
 * @Res {status, val:{}, error:{}}
 */
let deleteDeep1 = function (req, res, next) {
	let resData;
	let data = req.body;
	let dbService = new DBService(data.project);

	deleteDeep0(req, res, next, function (val) {
		if(val.status) {
			dbService.insertOrUpdateDoc(data.parent, function (error, body) {
				if(error){
					dbErrorLogger('Error at deleteDeep0', error);
					resData = getResMap(false, null, error);
				}
				else {
					resData = getResMap(true, body, null);
				}

				res.send(resData);
			})
		}
	});
}


/**
 * deleteDeep2 : delete specified document and all it's children
 *
 * @Param {project, val:{_id, _rev, links}}
 * @Return undefined
 * @Res {status, val:{}, error:{}}
 */
let deleteDeep2 = function (req, res, next) {
	let resData;
	let data = req.body;
	let dbService = new DBService(data.project);

	deleteDeep0(req, res, next, function (val) {
		if(val.status && data.val.links) {
			for(let i = 0; i < data.val.links.length; i++) {
				dbService.deleteDocById(data.val.links[i], function (error, body) {
					if(error) {
						dbErrorLogger('Error : 302', error);
					}
				});
			}
		}
	});
}





/**
 * Create
 * Create Level 0 : create doc
 * Create Level 1 : create doc and add id to parent node links
 * Create Level 2 : undefined
 */


/**
 * createDeep0 create new doc
 *
 * @Param {project, val:{_id, type}}
 * @Return undefined
 * @Res {status, val:{}, error:{}}
 */
let createDeep0 = function (req, res, next, callback) {
	let resData;
	let data = req.body;
	let dbService = new DBService(data.project);

	dbService.insertOrUpdateDoc(data.val, function (error, body) {
		if(error) {
			dbErrorLogger('Error at createDeep0', error);
			resData = getResMap(false, null, error);
		}
		else {
			resData = getResMap(true, body, null);
		}

		callback ?
			callback(resData) :
			res.send(resData)
	});
}


/**
 * createDeep1 create new doc and add id to parent node's links
 *
 * @Param {project, parent:{} val:{_id, type}}
 * @Return undefined
 * @Res {status, val:{}, error:{}}
 */
let createDeep1 = function (req, res, next) {
	let resData;
	let data = req.body;
	let dbService = new DBService(data.project);

	createDeep0(req, res, next, function (val) {
		if(val.status) {
			dbService.insertOrUpdateDoc(data.parent, function (error, body) {
				if(error) {
					dbErrorLogger('Error at createDeep1', error);
					resData = getResMap(false, null, error);
				}
				else {
					resData = getResMap(true, body, null);
				}

				res.send(resData);
			});
		}
	});
}




module.exports = router;
