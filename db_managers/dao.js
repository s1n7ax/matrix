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
    
    //this.test();
  }
  
  insertDoc(className, values) {
    return this.database
      .insert().into(className)
      .set(values)
      .one();
  }
  
  selectDoc(className, searchDocBy) {
    return this.database
      .select()
      .from(className)
      .where(searchDocBy)
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
  
  
//  Insert

/*  
  test() {
   
    this.insertDoc('Project', {
      name: 'testName1',
      description: 'desc',
      subclass_links: null
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (error) {
      console.error(error);
    });
  }
 */ 
  
  
  
  
  
// Delete  
  
/*  
  test() {
    this.deleteDoc('Project', {'name':'testName1'})
    .then(function (data) {
      console.log(data);
    })
    .catch(function (error) {
      console.error(error);
    });
  }
 */ 
  
  
  
  
    // Select
/*

  test() {
    this.selectDoc('Project', {
      name: 'testName1'
    })
    .then(function (data) {
      console.log(data);
    })
  }
*/


  
  
  
  
}

//let a = new DAO;


module.exports = DAO;

