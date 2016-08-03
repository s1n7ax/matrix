const Mocha = require('mocha');
const DAO = require('../core/db_accessors/dao');
const Mock = require('mock-couch');

let couch = new DAO;
let server = couch.createServer();
let db = couch.connectDB();

db.insertDoc({
  name: 'testName',
  description: 'testDescription',
  links: null
}, function (error, data, header) {
  console.log(error);
});