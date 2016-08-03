const Express = require('express');
const Path = require('path');
const router = Express.Router();
const DAO = require('../db_accessors');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(
    Path.join(__dirname, '../', 'views/index.html'));
});

router.get('/Create Project', function (req, res, next) {
  
})

class Services {
  
  constructor() {
    this.database = new DAO;
  }
  
  create(res) {
    this.database.insertDoc('Project', {
      name:'webTest'
    })
    .then(function(data) {
      res.send('hello world');
    })
    .catch(error){
      console.log(error);
    }
  }
}













module.exports = router;
