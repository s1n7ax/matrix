let OrientJS = require('orientjs');
let JsonFile = require('jsonfile');
let Path = require('path');

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
        this.createRecord('test', 'testrec', 'this is a test', null);
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

    createRecord(className, name, description, links) {

        let res = this.database.query('insert into ' + className + ' (name, description, link) values (:name, :description, :links)', {
            params: {
                "name": name,
                "description": description,
                "links": links
            }
        });
        console.log(res);
    }
}


let a = new DAO();