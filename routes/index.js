const Locator = require('../locator');
const express = require('express');
const router = express.Router();
const Services =  require(Locator.servicesPath.services);


router.get('/', function(req, res, next) {
    res.sendFile(Locator.viewsPath.index);
});


router.post('/createProject', function (req, res, next) {
	let services = new Services();
	
	services.createProject(req.body.projectName, function (error, body) {
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
	let services = new Services(req.body.projectName);

	console.log(req.body);

	services.insertOrUpdateDoc(req.body.values, function (error, body) {
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
	let services = new Services(req.body.projectName);

	services.insertOrUpdateDoc(req.body.values, function (error, body) {
		console.log('**************');
		console.log(req.body.module);
		console.log('**************');
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
				req.body.module.links = new Array;
				req.body.module.links.push(body.id);
			}
			else {
				req.body.module.links.push(body.id);
			}

			services.insertOrUpdateDoc(req.body.module, function (error, body) {
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
					})
				}
			});
		}
	});
});


router.post('/getAllProjects', function (req, res, next) {
	let services = new Services;
	let removeValues = ['_replicator', '_users'];
	
	services.getAllProjects(function (error, body) {
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
	})
});
router.post('/getAllModules', function (req, res, next) {
	let services = new Services(req.body.projectName);

	services.getAllModueDocs(undefined, function (error, body) {
		if(error) {
			res.send({
				'status': false,
				'body': null,
				'error': error
			});
		}
		else {
			let moduleArray = new Array;

			body.rows.forEach(function (data) {
				moduleArray.push(data.value);
			});

			res.send({
				'status': true,
				'body': moduleArray,
				'error': null
			});
		}
	})
});
router.post('/getAllTestCases', function (req, res, next) {
	let services = new Services(req.body.projectName);
	
	services.deepSelectById(services, req.body.id, function (error, body) {
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
});
router.post('/getAllComponents', function (req, res, next) {
	let services = new Services(req.body.projectName);

	services.deepSelectById(services, req.body.id, function (error, body) {
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
	})
});

router.post('/setComponent', function (req, res, next) {
	let services = new Services(req.body.projectName);

	services.insertOrUpdateDoc(req.body.values, function (error, body) {
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
				'body':body,
				'error': null
			});
		}	
	})
});


module.exports = router;