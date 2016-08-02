const SystemLogger = require('../loggers/system_logger');

class Services {
  
  constructor() {
  }

  add(values, itemName, callback) {
    this.database.insertDoc(values, itemName, callback);
  }
  
  delete(itemName, rev, callback) {
    this.database.delDoc(itemName, rev, callback);
  }
  
  rename() {
    
  }
  
  get(docName, callback){
    this.database.updateDoc(docName, callback);
  }
}

module.exports = Services;