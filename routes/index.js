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
  

  let data = req.body;
  let service = new Services(data.itemType);
  delete data.itemType;
  
  service.create(service, data, res); 
});



/**
 *********** GET ITEMS ***********
 *This should return all the rows in specific class
 */
 router.post('/getItems', function (req, res, next) {
	let service = new Services(req.body.itemType);
  service.getItems(service, res); 
});




module.exports = router;
