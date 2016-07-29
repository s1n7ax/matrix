const OrientJS = require('orientjs');
const JsonFile = require('jsonfile');
const Path = require('path');

class DAO {

  constructor() {
    let configFilePath = Path.join(__dirname, '../../', 'configuration', 'database.conf.json');
    let dbConfig = JsonFile.readFileSync(configFilePath);

    this.hostName = dbConfig.hostName;
    this.portNumber = dbConfig.portNumber;
    this.userName = dbConfig.userName;
    this.password = dbConfig.password;
    this.databaseName = dbConfig.databaseName;

    this.server = this.createServer();
    this.database = this.connectDatabase();
  }

  createServer() {
    return OrientJS({
      name: this.hostName,
      portNumber: this.portNumber,
      username: this.userName,
      password: this.password
    });
  }

  connectDatabase() {
    return this.server.use({
      name: this.databaseName
    });
  }

  setRecord(className, values) {
    return this.database.insert().into(className).set(values).one();
  }

  getRecord(className, values) {
    return this.database.select().from(className).where(values).all();
  }

  deleteRecord(className, values) {
    return this.database.query('delete from ' + className + '')
  }

  updateRecord(className, rid, values) {
    //
  }
}

module.exports = new DAO;