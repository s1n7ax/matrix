const Nano = require('nano');
const JsonFile = require('jsonfile');
const Path = require('path');

class DAO {

  constructor() {
    //let dbConfigurationPath = Path.join(__dirname, '../../', 'configuration', 'database.conf.json');
    // let dbConfiguration = JsonFile.readFileSync(dbConfigurationPath);
    
    this.hostName = 'localhost';
    this.portNumber = 3000;
    this.userName = 'admin';
    this.password = 'admintest1';

    this.server = this.createServer()

    // this.server.db.destroy('automate_project_db');

    this.server.db.create('automate_project_db');
    // this.server.db.create('automate_tc_db');
    // this.server.db.create('automate_bc_db');
  }

  createServer() {
    let url = 'http://' +
      this.userName + ':' +
      this.password + '@' +
      this.hostName + ':' + 
      this.portNumber;
    console.log(url);
    return Nano(url);
  }

  connectDB() {
   return this.server.db.use(this.databaseName);
  }

  insertDoc() {
    
  }
}

let a = new DAO();