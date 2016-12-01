const Locator = require('../locator');
const Nano = require('nano');
const JsonFile = require('jsonfile');
const io = require('socket.io')(3001);
const Path = require('path');

class Service {
    constructor (project) {
        let dbConf = JsonFile.readFileSync(Locator.configurationPath.database_conf);
        let connectionQuery = `http://${dbConf.username}:${dbConf.password}@${dbConf.host}:${dbConf.port}`;

        this.server = Nano(connectionQuery);
        this.database = this.server.use(project);
    }

    selectById (id, callback) {
        this.database.get(id, callback);
    }

    getAllTestsuiteDocs (callback) {
        this.database.view('Automate', 'getAllTestsuites', callback)
    }

    getAllTestCaseDocs (callback) {
        this.database.view('Automate', 'getAllTestCases', callback)
    }

    getAllComponentDocs (callback) {
        this.database.view('Automate', 'getAllComponents', callback)
    }

    getAllLibraryDocs (callback) {
        this.database.view('Automate', 'getAllLibraries', callback)
    }

    getAllDocs (callback) {
        this.database.view('Automate', 'getAll', callback)
    }
}

module.exports = Service;