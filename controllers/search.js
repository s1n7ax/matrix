var FS = require('fs');
var Path = require('path');
var Jsonfile = require('jsonfile');

var search = function () {};

search.prototype.projectContainerDirPath = null;

/*interface*/
search.prototype.setPaths = function () {
  this.projectContainerDirPath =  Path.join(__dirname, '../projects');
};

search.prototype.getProjectNames = function () {
    
  var projectNames =
  FS.readdirSync(this.projectContainerDirPath)
  .filter(event => FS.statSync(Path.join(this.projectContainerDirPath)).isDirectory());
  
  return projectNames;
};





module.exports = search;