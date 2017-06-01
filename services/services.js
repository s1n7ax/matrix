const Locator = require('../locator');
const Nano = require('nano');
const JsonFile = require('jsonfile');
const io = require('socket.io')(444);
const Path = require('path');


class Service {

    dbErrorLogger(customMsg, error) {
        console.log('\n');
        console.log('****************************');
        console.error(customMsg);
        console.error(error.error);
        console.error(error.reason);
        console.log('\n');
        console.log('Request Details:');
        console.log(error.request.body);
        console.log(error.request.uri);
        console.log('\n');
        console.log('Date & Time:');
        console.log(error.headers.date);
        console.log('****************************');
    }

    constructor(dbName, startSocket) {
        let self = this;

        let dbConf = JsonFile.readFileSync(Locator.configurationPath.database_conf);
        let connectionQuery = `http://${dbConf.username}:${dbConf.password}@${dbConf.host}:${dbConf.port}`;
        this.compactionInterval = dbConf.db_compaction_interval_min * 1000 * 60;

        this.server = Nano(connectionQuery);

        this.dbName = dbName;
        this.database = this.server.use(dbName);

        if((dbName !== undefined) && startSocket){
            this.feed = this.database.follow({since: "now"});
            this.socket = io.of('/'+dbName);

            this.startSocket();
            this.followDB();
            this.compaction(function (error, body) {
                if(error){
                    console.log('##########Compaction of db '+ self.dbName +' - Failed!##########');
                    console.log(error);
                }
                else{
                    console.log('Compaction of db '+ self.dbName +' - Successful!');
                }
            });
        }
    }

    compaction(callback) {
        let self = this;


        console.log('\n\n************** Compaction of db '+ self.dbName +' - Started! **************\n**************Next automated compaction will be in **************' + this.compactionInterval + ' sec!\n');
        self.server.db.compact(self.dbName, callback);
        // callback(false);


        setTimeout(function () {
            self.compaction(function (error, body) {
                if(error){
                    console.error(error);
                    console.log('##########Compaction of db '+ self.dbName +' - Failed!##########');
                }
                else
                    console.log('************** Compaction of db '+ self.dbName +' - Successful! **************');
            });
        }, this.compactionInterval);
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

    deleteDocById (id, callback) {
        let self = this;
        self.selectDocById(id, function (error, body) {
            if(error) {
                self.dbErrorLogger('Error : 301', error);
            }
            else {
                self.deleteDocByIdAndRev(body._id, body._rev, function (d_error, d_body) {
                    if(d_error){
                        callback(d_error, d_body);
                    }else{
                        self.compaction(function (error, body){
                            if(error)
                                console.error(error);
                            else{
                                console.log('Compaction of db '+ self.dbName +' - Successful!');
                                callback(d_error, d_body);
                            }
                        });
                    }
                });
            }
        })
    }

	deleteDocByIdAndRev (id, rev, callback) {
        let self = this;

		this.database.destroy(id, rev, function (d_error, d_body){
            if(d_error){
                callback(d_error, d_body);
            }else{
                self.compaction(function (error, body) {
                    if(error)
                        console.error(error);
                    else
                        console.log('Compaction of db '+ self.dbName +' - Successful!');
                        callback(d_error, d_body);
                    });
            }
        });
	}

	copyDocById(srcID, destID, callback) {
        this.database.copy(srcID , destID, callback)
	}



    getAllTestsuiteDocs (keysObject, callback) {
        keysObject !== undefined ?
        this.database.view('Automate', 'getAllTestsuites', keysObject, callback)
        : this.database.view('Automate', 'getAllTestsuites', callback)
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

    getAllLibraryDocs (keysObject, callback) {
            keysObject !== undefined ?
            this.database.view('Automate', 'getAllLibraries', keysObject, callback)
            : this.database.view('Automate', 'getAllLibraries', callback)
    }

    getAllDocs (keysObject, callback) {
        keysObject !== undefined ?
        this.database.view('Automate', 'getAll', keysObject, callback)
        : this.database.view('Automate', 'getAll', callback)
    }


    getAllUsers (keysObject, callback) {
        keysObject !== undefined ?
        this.database.view('Automate', 'getAllUsers', keysObject, callback)
        : this.database.view('Automate', 'getAllUsers', callback)
    }

    getAllTCsAndBCs (callback) {
        let self = this;
        let tc = [];
        let bc = [];

        self.getAllTestCaseDocs(undefined, function (error, body) {
            if(error){
                throw 'Getting Testcase Failed';
            }else{
                body.rows.forEach(function (data) {
                    tc.push(data.value);
                });


                self.getAllComponentDocs(undefined, function (error, body) {
                    if(error){
                        throw 'Getting Components Failed';
                    }else{
                        body.rows.forEach(function (data) {
                            bc.push(data.value);
                        });
                        callback(tc, bc);
                    }
                });
            }
        })
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
        console.log('following DB '+ this.dbName);
        let self = this;

        this.feed.on('change', function(change) {
            debugger;
            let result;

            if(change.deleted) {
                self.broadcast({
                    change: 'delete',
                    val: {
                        _id: change.id
                    }
                });
            }
            else {
                self.selectDocById(change.id, function (error, body) {
                    error ?
                        /**
                         * This can be occurred because db is down
                         */
                        console.error('error 305') &
                        console.error(error) :
                        self.broadcast({
                            change: 'add',
                            val: body
                        });
                });
            }


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
        let self = this;
        console.log('\n********** Starting socket - Successful! **********')

        this.socket.on('connection', function (socket) {
            socket.emit('ServerMessage', `Server : Connecting to project "${self.dbName}" socket server - Successful!`);

            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
        });


    }
}


module.exports = Service;
