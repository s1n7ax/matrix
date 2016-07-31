const Nano = require('nano');
const JsonFile = require('jsonfile');
const Path = require('path');

class DAO {

  constructor(dbType) {
    let dbConfigurationPath = Path.join(__dirname, '../../', 'configuration', 'database.conf.json');
    let dbConfiguration = JsonFile.readFileSync(dbConfigurationPath);
    
    this.hostName = dbConfiguration.hostName;
    this.portNumber = dbConfiguration.portNumber;
    this.userName = dbConfiguration.userName;
    this.password = dbConfiguration.password;
    
    switch (dbType) {
      case 'project':
        this.dbName = dbConfiguration.projectDBName; break;

      case 'module':
        this.dbName = dbConfiguration.moduleDBName; break;

      case 'tc':
        this.dbName = dbConfiguration.tcDBName; break;

      case 'bc':
        this.dbName = dbConfiguration.bcDBName; break;
    
      default:
        console.log('invalide '+dbType+' database name'); break;
    }

    this.server = this.createServer();
    this.database = this.connectDB();

    // this.server.db.destroy('automate_project_db');

    // this.server.db.create('automate_project_db');

    /*this.database.get('project 2', function (error, message){
      console.log(error);
      console.log(message);
    })*/

  }

  createServer() {
    let url = 'http://' +
      this.userName + ':' +
      this.password + '@' +
      this.hostName + ':' + 
      this.portNumber;
    
    return Nano(url, function (error, body) {
      if(error){
        console.log('Creating server - Error');
        console.error(error);
      }
      else
        console.log('Creating server - Successful');
    });
  }

  connectDB() {
   return this.server.db.use(this.dbName);
  }

  insertDoc(doc, docName, callback) {
    this.database.insert(doc, docName, callback);
  }

  delDoc(docName, rev, callback) {
    this.database.destroy(docName, rev, callback);
  }

  getDoc(docName, callback) {
    this.database.get(docName, callback);
  }

  updateDoc(doc, callback) {
    this.database.insert(doc, callback);
  }
}

let obj = new DAO('project');

obj.updateDoc({
  _id : 'project 2',
  _rev : '2-8abacb8c1cfe0854607706b0df7a3c01',
  description : 'test'
}, function (error, data) {
  if(error)
    console.log(error.message);
  else
    console.log(data);
})