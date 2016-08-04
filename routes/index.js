const express = require('express');
const router = express.Router();
const Locator = require('../locator');
const Services = require(Locator.servicesPath.services);





router.get('/', function(req, res, next) {
  res.sendFile(Locator.viewsPath.index);
});


router.get('/test', function(req, res, next) {
  let ser = new Services('Project');
  ser.create(ser, {
    name: 'test1',
    description: 'test1'
  }, res);
});


module.exports = router;
