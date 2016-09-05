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
    
//   this.test();
  }
  
  
  insertDoc (className, values) {
    return this.database
      .insert().into(className)
      .set(values)
      .one();
  }
  
  insertLink (searchDocBy, linkRID) {
    return this.database.query(`update ${searchDocBy} add subclass_links=${linkRID}`)
  }  
  
  
  selectDocs (className) {
    return this.database
      .select()
      .from(className)
      .all();
  }
  
  selectDocsBy (className, searchDocsBy) {
    return this.database
      .select()
      .from(className)
      .where(searchDocsBy)
      .all();
  }
  
  selectDocsByRIDs (className, data) {
    console.log(data.itemRIDs);
    return this.database.query(`select from ProjectModule where @rid in [${data.itemRIDs}]`);
  }
  
  
  updateDoc (className, searchDocBy, values) {
    return this.database.update(className)
      .set(values)
      .where(searchDocBy)
      .one();
  }
  
  deleteDoc (className, searchDocBy) {
    return this.database
      .delete()
      .from(className)
      .where(searchDocBy)
      .limit(1)
      .all();
  }
  
  
  
/*  test () {
    this.selectDocsBy('Project', ['#12:0', '#12:1', '#12:2'])
    .then(function (data) {
      console.log(data);
    })
  }*/

}


//var a = new DAO('Project');

 module.exports = DAO;

