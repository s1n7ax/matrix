const fs = require('fs');
const path = require('path');

/*****************Service Interface*****************/
var Services = function () { }


/*****************Common Properties*****************/



/*****************Common Functions*****************/



/*****************User Exceptions*****************/
Services.prototype.userException = function (name, message, htmlMessage) {
  this.name = name;
  this.message = message;
  this.htmlMessage = htmlMessage;
  Error.captureStackTrace(this);
}









module.exports = Services;