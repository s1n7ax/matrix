const Locator = require('../locator');
const express = require('express');
const router = express.Router();
const Services =  require(Locator.servicesPath.services);


/**
 *********** ROOT ***********
 */
router.get('/', function(req, res, next) {
    res.sendFile(Locator.viewsPath.index);
});


/**
 *********** PROJECT ***********
 */
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
			removeValues.forEach(function(val, index) {
				console.log('\n');
				console.log(body);
				console.log('\n');
				console.log(body.indexOf(val) > -1);
				console.log(val);
				console.log(index);
				if(body.indexOf(val) > -1){
					body.splice(index, 1);
					console.log(body);
				}
			});
			
			res.send({
				'status': true,
				'body': body,
				'error': null
			})
		}
	})
});


/**
 *********** DOCUMENT ***********
 */


module.exports = router;