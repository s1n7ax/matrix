const fs = require('fs');
const path = require('path');

const Controller = new Function;

//************** User Exeption **************//
Controller.prototype.userException = new Object;
Controller.prototype.userException.create  = function (name, message, htmlMessage) {
  this.name = name;
  this.message = message;
  this.htmlMessage = htmlMessage;
  Error.captureStackTrace(this);
}

//************** Project Container **************//
Controller.prototype.projectContainer = new Object;
Controller.prototype.projectContainer.path = path.join(__dirname, '../tesat.js');
Controller.prototype.projectContainer.isExist = function (ab) {
  try {
    if (!fs.lstatSync(ab.projectContainer.path).isDirectory())
      throw new this.userException.create(
        'InvalideDirectoryPathException',
        '"projects" directory not found in the application',
        '<b>projects</b> directory not found in the application'
      )
    else
      console.log('exist : project container exists');
  } catch (error) {
      //console.error(error.stack);
  }
}

var a = new Controller;
console.log(a.projectContainer.path);
console.log(a.projectContainer.isExist(a));
// throw new a.userException.createException('new', 'test', 'a');

//module.exports = Controller;