var FS = require('fs');
var Path = require('path');
var Jsonfile = require('jsonfile');

var itemGetters = function (projectName) {};

itemGetters.prototype.projectContainerDirPath = Path.join(__dirname, '../projects');
itemGetters.prototype.projectDirPath = projectName;
itemGetters.prototype.moduleFilePath = 'module.json';
itemGetters.prototype.tcFilePath = 'tc.json';
itemGetters.prototype.bcDirPath = 'bc';


itemGetters.prototype.getProjectNames = function () {
    
  var projectNames =
  FS.readdirSync(this.projectContainerDirPath)
  .filter(event => FS.statSync(Path.join(this.projectContainerDirPath)).isDirectory());
  
  return projectNames;
};

itemGetters.prototype.getModuleNames = function () {
  
}





module.exports = itemGetters;