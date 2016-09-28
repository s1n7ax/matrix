const Locator = require('../locator');
const http = require('http');
const express = require('express');
const router = express.Router();
const Service =  require(Locator.servicesPath.services);

let service = new Service();
let services = new Object();

let serviceProvider = function () {
	let removeValues = ['_replicator', '_users'];
	
	service.getAllProjects(function (error, body) {
		error ?
			console.error(error) :
			removeValues.forEach(function (val) {
				if((index = body.indexOf(val)) > -1) {
					body.splice(index, 1);
				}
			})

		
		body.forEach(function (val) {
			services[val] = new Service(val);
		});

		console.log('Service Providers : Ready!')
	});
}

serviceProvider();



router.get('/', function(req, res, next) {
    res.sendFile(Locator.viewsPath.index);
});


router.post('/createProject', function (req, res, next) {
	
	service.createProject(req.body.projectName, function (error, body) {
		if(error) {
			res.send({
				'status': false,
				'data': null,
				'error': error
			});
		}
		else {
			let design = { _id: '_design/Automate',
						  language: 'javascript',
						  views:{ 
						  	getAllModules: { map: 'function(doc) { doc.type === \'module\' && emit(doc._id, doc); }' },
						     getAllTestCases: { map: 'function (doc) {if(doc.type == \'testcase\') {emit(doc._id, doc);}}' },
						     getAllComponents: { map: 'function(doc) { doc.type === \'component\' && emit(doc._id, doc) }' },
						     getAll: { map: 'function(doc) { doc._id !== \'_design/Automate\' && emit(doc._id, doc) }' } 
						  } 
						};

			let newService = new Services(req.body.projectName);
			newService.insertOrUpdateDoc(design, function (error, body) {
				if(error) {
					res.send({
						'status': false,
						'data': null,
						'error': error
					});
				}
				else {
					res.send({
						'status': true,
						'body': body,
						'error': null
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
				'body': null,
				'error': error
			});
		}
		else {
			req.send({
				'status': true,
				'body': body,
				'error': null
			});
		}
	})
});

router.post('/createModule', function (req, res, next) {
	let projectService = services[req.body.projectName];

	projectService.insertOrUpdateDoc(req.body.values, function (error, body) {
		if(error) {
			res.send({
				'status': false,
				'body': null,
				'error': error
			});
		}
		else {
			res.send({
				'status': true,
				'body': body,
				'error': null
			});
		}
	});
});

router.post('/createTestCase', function(req, res, next) {
	let projectService = services[req.body.projectName];

	projectService.insertOrUpdateDoc(req.body.values, function (error, body) {
		if(error) {
			console.error(error);
			res.send({
				'status': false,
				'body': null,
				'error': error
			});
		}
		else {
			
			if(req.body.module.links === undefined) {
				req.body.module.links = new Array();
				req.body.module.links.push(body.id);
			}
			else {
				req.body.module.links.push(body.id);
			}

			projectService.insertOrUpdateDoc(req.body.module, function (error, body) {
				if(error) {
					res.send({
						'status': false,
						'body': null,
						'error': error
					});
				}
				else {
					res.send({
						'status': true,
						'body': body,
						'error': null
					});
				}
			});
		}
	});
});


/**
 * GET ALL ITEMS
 */
router.post('/getAllProjects', function (req, res, next) {
	let removeValues = ['_replicator', '_users'];
	
	service.getAllProjects(function (error, body) {
		if(error) {
			res.send({
				'status': false,
				'body': null,
				'error': error
			});
		}
		else {
			removeValues.forEach(function (val) {
				if((index = body.indexOf(val)) > -1) {
					body.splice(index, 1);
				}
			});
			res.send({
				'status': true,
				'body': body,
				'error': null
			});
		}
	});
});
router.post('/getAllModules', function (req, res, next) {
	let projectService = services[req.body.projectName];
	let result = new Array;
	
	projectService.getAllModueDocs(undefined, function (error, body) {
		if(error) {
			console.error(error)
			res.send({
				'status': false,
				'body': null,
				'error': error
			});
		}
		else {
			body.rows.forEach(function (data) {
				result.push(data.value);
			});

			res.send({
				'status': true,
				'body': result,
				'error': null
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
				'body': result,
				'error': null
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
				'body': null,
				'error': error
			});
		}
		else {
			body.rows.forEach(function (data) {
				result.push(data.value);
			});

			res.send({
				'status': true,
				'body': result,
				'error': null
			});
		}
	});
});


/**
 * GET ALL ITEMS
 */
router.post('/setComponent', function (req, res, next) {
	console.log('/setComponent');
	console.log(services[req.body.projectName].dbName);
	let projectService = services[req.body.projectName];

	projectService.insertOrUpdateDoc(req.body.values, function (error, body) {
		if(error) {
			console.error(error);
			res.send({
				'status': false,
				'body': null,
				'error': error
			});
		}
		else {
			res.send({
				'status': true,
				'body':body,
				'error': null
			});
		}	
	})
});


module.exports = router;