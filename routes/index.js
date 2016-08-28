const express = require('express');
const router = express.Router();
const Locator = require('../locator');
const Services = require(Locator.servicesPath.services);




/**
 *********** ROOT ***********
 */
router.get('/', function (req, res, next) {
  res.sendFile(Locator.viewsPath.index);
});


/**
 *********** CREATE ITEMS ***********
 */

 /**
 * CREATE PROJECT
 */
router.post('/createProject', function (req, res, next) {
	let service = new Services('Project');
	console.log(req.body);
  	service.create(service, req.body, res); 
});



/**
 *********** GET ITEMS ***********
 */

 /**
 * GET ALL PROJECT
 */
 router.post('/getProjects', function (req, res, next) {
	let service = new Services('Project');
  	service.getItems(service, res); 
});

  /**
 * GET ALL MODULES
 */
 router.post('/getModules', function (req, res, next) {
	let service = new Services('Module');
  	service.getItems(service, res); 
});


module.exports = router;
