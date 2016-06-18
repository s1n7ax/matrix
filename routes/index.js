var express = require('express');
var Path = require('path');
var router = express.Router();

var SearchPrototype = require('../controllers/search');

var Search = function () { };
Search = new SearchPrototype();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(
    Path.join(__dirname, '../', 'views/index.html'));
});


router.post('/getProjectNames', function (req, res) {
  Search.setPaths();
  var projectNames = Search.getProjectNames();
  res.send(projectNames);
});

module.exports = router;
