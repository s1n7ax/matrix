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
    insertOrUpdateDoc (valuesObject, callback) {
        this.database.insert(valuesObject, callback);
    }

    selectDocById (id, callback) {
        this.database.get(id, callback);
    }
	
	deleteDocByIdAndRev (id, rev, callback) {
		this.database.destroy(id, rev, callback);
	}
	
	copyDocById(srcID, destID, opts, callback) {
		opts !== undefined ?
		this.database.copy(srcID , destID, opts, callback)
		: this.database.copy(srcID , destID, callback)
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
                callback(error);
            }
            else {
				let linksLength = body.links.length;
                if(body.links !== undefined) {
                    body.links.forEach(function (id, index) {
                        self.selectDocById(id, function(error, body) {
                            if(error) {
                                callback(error);
                            }
                            else {
                                result.push(body);
                                if(linksLength === (index + 1)) {
                                    callback(null, result);
                                }
                            }
                        });
                    });
                }
            }
        });
    }
	
	createAndLinkDoc (self, mainDocID, valuesObject, callback) {
		self.insertOrUpdateDoc(valuesObject, function (error, body) {
			if(error) {
				callback(error);
			}
			else {
				let id = body.id;
				self.selectDocById(mainDocID, function (error, body) {
					if(error) {
						self.deleteDocByIdAndRev();
						callback(error);
					}
					else {
						let data = body;
						if(data.links !== undefined) {
							data.links.push(id);
						}
						else {
							data.links = [];
							data.links.push(id);
						}
						self.insertOrUpdateDoc(data, function (error, body) {
							if(error) {
								callback(error);
							}
							else {
								callback(null, body);
							}
						});
					}
				});
			}
		});
	}
}



module.exports = Services;
