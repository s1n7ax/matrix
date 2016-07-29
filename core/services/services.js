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
  
  add() {
  
  }
  
  delete() {
    
  }
  
  rename() {
    
  }
  
  get(){
    
  }
  
}








module.exports = Services;