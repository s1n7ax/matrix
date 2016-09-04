const Locator = require('../locator');
const OrientJS = require('orientjs');
const JsonFile = require('jsonfile');
const Path = require('path');

class DAO {
  
  constructor() {
    
    let dbConf = JsonFile.readFileSync(
      Locator.configurationPath.database_conf);
    
    this.server = OrientJS({
      host: dbConf.host,
      port: dbConf.port,
      username: dbConf.username,
      password: dbConf.password
    });
    
    this.database = this.server.use({
      name: dbConf.database_name
    });
    
   this.test();
  }
  
  insertDoc(className, values) {
    return this.database
      .insert().into(className)
      .set(values)
      .one();
  }
  
  selectDocBy(className, searchDocBy) {
    return this.database
      .select()
      .from(className)
      .where(searchDocBy)
      .all();
  }

  selectDocs(className) {
    return this.database
      .select()
      .from(className)
      .all();
  }
  
  updateDoc(className, searchDocBy, values) {
    return this.database.update(className)
      .set(values)
      .where(searchDocBy)
      .one();
  }
  
  deleteDoc(className, searchDocBy) {
    return this.database
      .delete()
      .from(className)
      .where(searchDocBy)
      .limit(1)
      .all();
  }
  
  test () {
    this.database.update('Project')
    .set({'subclass_links': '#51:0'})
    .where({'@rid': '#41:0'})
    .one()

    .then(function (data) {
      console.log(data);
    }).catch(function (error) {
      console.error(error);
    });

  }


}


var a = new DAO('Project');

// module.exports = DAO;

