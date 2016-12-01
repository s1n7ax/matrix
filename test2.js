const Locator = require('./locator');
const Nano = require('nano');
const JsonFile = require('jsonfile');
const Path = require('path');


class Service {

    constructor() {

        let dbConf = JsonFile.readFileSync(Locator.configurationPath.database_conf);
        let connectionQuery = `http://${dbConf.username}:${dbConf.password}@${dbConf.host}:${dbConf.port}`;

        this.server = Nano(connectionQuery);

        this.database = this.server.use('eag_velocity');

        this.copy();
    }

    copy () {
        this.database.copy('tc_010', 'tc_011', function (error,body) {
            if(error) {
                console.log(error);
            }
            else {
                console.log(body);
            }
        });
    }
}


let a = new Service();




