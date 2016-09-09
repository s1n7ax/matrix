const Locator = require('../locator');
const express = require('express');
const router = express.Router();
const Services = require(Locator.servicesPath.services);
const DAO = require(Locator.dbManagersPath.dao);




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
router.post('/deepProjectUpdate', function(req, res) {

	console.log('\n');
    console.log('****** deepProjectUpdate - Inprogress ******');

    let dao = new DAO;
    dao.deepSearchByID(req.body.rid)
        .then(function(data) {
		
            res.send({
				'status': true,
				'error': null,
				'data': data 
			});
            console.log('****** deepProjectUpdate - Successful ******');
			console.log('\n');
        })
		.catch(function(error) {
			
			res.send({
				'status': false,
				'error': error,
				'data': null
			});
			console.log('****** deepProjectUpdate - Failed ******')
			console.log('\n');
		});
});




module.exports = router;