const fs = require('fs');
const path = require('path');


/*****************Service Interface*****************/
class Services {

  constructor() {
  }

  userException(name, message, htmlMessage) {
    this.name = name;
    this.message = message;
    this.htmlMessage = htmlMessage;
    Error.captureStackTrace(this);
  }

  
}








module.exports = Services;