const Locator = require('../locator');
const Nano = require('nano');
const JsonFile = require('jsonfile');
const Path = require('path');

class Services {

    constructor(dbName = 'automate_project_db') {

        let dbConf = JsonFile.readFileSync(Locator.configurationPath.database_conf);
        let connectionQuery = `http://${dbConf.username}:${dbConf.password}@${dbConf.host}:${dbConf.port}`;
        
        this.server = Nano(connectionQuery);
        this.database = this.server.use(dbName);

        /*this.selectDocById('Core HR', function (error, body) {
            console.log(body);
        })*/

    }

    /* 
     * PROJECT
     */
    createProject (dbName, callback) {
        this.server.db.create(dbName, callback);
    }

    deleteProject (dbName, callback) {
        this.server.db.destroy(dbName, callback);
    }

    getAllProjects (callback) {
        this.server.db.list(callback);
    }


    /*
     * DOCUMENT
     */
    insertDoc (valuesObject, callback) {
        this.database.insert(valuesObject, callback);
    }

    selectDocById (id, callback) {
        this.database.get(id, callback);
    }

    getAllTypeDocs (keysObject, callback) {
        keys !== undefined ? 
        this.database.view('Automate', 'getAllModules', keysObject, callback)
        : this.database.view('Automate', 'getAllModules', callback)
    }

    getAllDocs (keysObject, callback) {
        keysObject !== undefined ?
        this.database.view('Automate', 'getAll', keysObject, callback)
        : this.database.view('Automate', 'getAll', callback)
    }

    deepSelectById (self, id, callback) {
        let result = new Array;

        self.selectDocById (id, function (error, body) {
            if(error) {
                console.error(error);
            }
            else {
                if(body.links !== undefined) {
                    body.links.forEach(function (id, index) {
                        self.selectDocById(id, function(error, body) {
                            if(error) {
                                console.error(error);
                            }
                            else {
                                result.push(body);
                                if(body.links.length === (index + 1)) {
                                    callback(result);
                                }
                            }
                        });
                    });
                }
            }
        });
    }
}


var a = new Services;

a.deepSelectById(a, 'Core HR', function (data) {
            console.log(data);
        })

module.exports = Services;
