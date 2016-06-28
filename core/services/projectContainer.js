const fs = require('fs');
const path = require('path');
const services = require('./services');



/*****************Service Interface*****************/
const ProjectContainer = function () {
  this.path = path.join(__dirname, '../../projects');
  this.isExist();
}
ProjectContainer.prototype = Object.create(services.prototype)

/*****************Project Container*****************/
ProjectContainer.prototype.getPath = function () {
  return this.path;
}
ProjectContainer.prototype.isExist = function () {
  if (!fs.lstatSync(this.path).isDirectory())
    throw new this.userException(
      'InvalideDirectoryPathException',
      '"projects" directory not found in the application',
      '<b>projects</b> directory not found in the application'
    )
  else
    console.log('exist : project container exists');
}


var a = new ProjectContainer();
