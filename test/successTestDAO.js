const Assert = require('assert');
const DAO = require('../core/data_access_object/dao');

describe('Validat Configuration', function () {
    let define1 = 'validate database configuration file data with class variables';
    it(define1, function () {

        let obj1 = new DAO();

        let hostName = 'cmdsnmuhandiram';
        let portNumber = 2480;
        let userName = 'admin';
        let password = 'admin';
        let databaseName = 'AutomateProjectDB';

        Assert.equal(typeof obj1.hostName, 'string');
        Assert.equal(typeof obj1.portNumber, 'int');
        Assert.equal(typeof obj1.userName, 'string');
        Assert.equal(typeof obj1.password, 'string');
        Assert.equal(typeof obj1.databaseName, 'string');

        Assert.equal(obj1.hostName, hostName);
        Assert.equal(obj1.portNumber, portNumber);
        Assert.equal(obj1.userName, userName);
        Assert.equal(obj1.password, password);
        Assert.equal(obj1.databaseName, databaseName);
    });
});