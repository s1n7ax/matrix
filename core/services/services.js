const fs = require('fs');
const path = require('path');

/*****************Service Interface*****************/
var Services = function (){}

/*****************User Exceptions*****************/
Services.prototype.userException  = function (name, message, htmlMessage) {
  this.name = name;
  this.message = message;
  this.htmlMessage = htmlMessage;
  Error.captureStackTrace(this);
}
Services.prototype.create = new Function;


module.exports = Services;