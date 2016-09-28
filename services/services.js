const Locator = require('../locator');
const Nano = require('nano');
const JsonFile = require('jsonfile');
const io = require('socket.io')(3001);
const Path = require('path');


/*class Service {
    constructor(dbName) {

        let dbConf = JsonFile.readFileSync(Locator.configurationPath.database_conf);
        let connectionQuery = `http://${dbConf.username}:${dbConf.password}@${dbConf.host}:${dbConf.port}`;
        
        this.server = Nano(connectionQuery);
    }

    createProject () {
        console.log('hello')
    }
}

let a = new Service();
console.log(a);
a.createProject();*/

class Service {



    constructor(dbName) {

        let dbConf = JsonFile.readFileSync(Locator.configurationPath.database_conf);
        let connectionQuery = `http://${dbConf.username}:${dbConf.password}@${dbConf.host}:${dbConf.port}`;
        
        this.server = Nano(connectionQuery);



        if(dbName !== undefined){
            this.dbName = dbName;
            this.database = this.server.use(dbName)
            this.feed = this.database.follow({since: "now"})
            this.socket = io.of('/'+dbName);

            this.startSocket();
            this.followDB();
        }
        else {
            console.log('db Name : '+dbName)
        }
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


    getAllModueDocs (keysObject, callback) {
        keysObject !== undefined ? 
        this.database.view('Automate', 'getAllModules', keysObject, callback)
        : this.database.view('Automate', 'getAllModules', callback)
    }

    getAllTestCaseDocs (keysObject, callback) {
        keysObject !== undefined ? 
        this.database.view('Automate', 'getAllTestCases', keysObject, callback)
        : this.database.view('Automate', 'getAllTestCases', callback)
    }

    getAllComponentDocs (keysObject, callback) {
        keysObject !== undefined ? 
        this.database.view('Automate', 'getAllComponents', keysObject, callback)
        : this.database.view('Automate', 'getAllComponents', callback)
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
                if(body.links !== undefined) {
                    self.getAllDocs({'keys': body.links}, function (error, body) {
                        if(error) {
                            callback(error);
                        }
                        else {
                            let testcaseArray = new Array;

                            body.rows.forEach(function (data) {
                                testcaseArray.push(data.value);
                            });
                            
                            callback(false, testcaseArray);
                        }
                    })
                }
                else {
                    callback(false, []);
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
								callback(false, body);
							}
						});
					}
				});
			}
		});
	}


    followDB () {
        let self = this;

        this.feed.on('change', function(change) {
            self.selectDocById(change.id, function (error, body) {
                error ? console.log(error) : self.broadcast(body.type)
            });
        });

        this.feed.follow();
        /*process.nextTick(function () {
            callback();
        });*/
    }

    broadcast (type) {
        this.socket.emit('updates', type);
    }

    startSocket () {
        let user = 0;
        /*io.on('connection', function (socket) {
            console.log('connecting user')

            socket.send('this is a message');

            io.sockets.emit('broadcast', 'broadcasting');

            socket.on('disconnect', function () {
                console.log('disconnecting user');
            });

            setTimeout(function () {
                io.sockets.emit('broadcast', 'broadcasting after 5 sec');
            }, 5000);
        });*/

        
        this.socket.on('connection', function (socket) {
            console.log('User '+(++user)+' connected');

            socket.on('disconnect', function () {
                console.log('User '+(--user)+' disconnected');
            });
        });

        

        /*this.socket.on('connection', function (socket) {
            socket.emit('test', 'test');
        });*/
    } 
}



module.exports = Service;


