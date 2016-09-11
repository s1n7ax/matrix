const Locator = require('../locator');
const express = require('express');
const router = express.Router();
const Services = require(Locator.servicesPath.services);




/**
 *********** ROOT ***********
 */
router.get('/', function(req, res, next) {
    res.sendFile(Locator.viewsPath.index);
});


/**
 *********** CREATE ITEMS ***********
 */



/**
 *********** GET ITEMS ***********
 */

module.exports = router;