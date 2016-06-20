const fs = require('fs');
const path = require('path');
const Controller = require('./controller');

var Project = new Function;
Project = Controller;

var a = new Project;
console.log(a.projectContainer.path);
//console.log(a.projectContainer.isExist());