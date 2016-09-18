const Locator = require('../locator');
const express = require('express');
const router = express.Router();
const Services =  require(Locator.servicesPath.services);


router.get('/', function(req, res, next) {
    res.sendFile(Locator.viewsPath.index);
});


router.post('/createProject', function (req, res, next) {
	let services = new Services();
	
	services.createProject(req.body.values.projectName, function (error, body) {
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
	})
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
	let services = new Services(req.projectName);

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
})


module.exports = router;