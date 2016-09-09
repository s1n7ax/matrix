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
	  
	  	this.testDeepSearchByID();
    }
  
  	deepSearchByID (rid) {
	  	return this.database.query('SELECT FROM '+rid+' fetchplan *:-1');
	}
  
  	testDeepSearchByID() {
		this.deepSearchByID('#10:0').then(function(data) {
			console.log(data);
		})
	}
	
	
}


var a = new DAO;
module.exports = DAO;