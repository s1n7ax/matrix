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
router.post('/createItem', function (req, res, next) {
	let service = new Services('Project');
	console.log(req.body);
  	service.create(service, req.body, res); 
});



/**
 *********** GET ITEMS ***********
 */
 router.post('/getItems', function (req, res, next) {
	let service = new Services('Project');
  	service.getItems(service, res); 
});




module.exports = router;
