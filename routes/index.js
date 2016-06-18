var express = require('express');
var router = express.Router();
var Search = require('../controllers/search');

var search = new Search();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/getProjectNames', function (req, res) {
  console.log('i got it');
  Search.setPaths;
  var projectNames = Search.getProjectNames();
  res.send(projectNames);
})

router.get('/getProjectNames', function (req, res) {
  console.log('i got it');
  Search.setPaths();
  var projectNames = Search.getProjectNames();
  res.send(projectNames);
})

module.exports = router;
