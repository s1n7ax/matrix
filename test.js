const co = require('co');
const fs = require('fs');
const OrientJS = require('orientjs');

function readFile(fileName) {
    return function (callback) {
        fs.readFile(fileName, callback);
    }
}

function selectFrom (tableName) {
    return function () {
        var server = OrientJS({
            host: dbConf.host,
            port: dbConf.port,
            username: dbConf.username,
            password: dbConf.password
        });

        var database = server.use('AutomateProjectDB');

        database
        .select()
        .from('tableName')
        .where({'@rid': '#74:0'})
        .all()
        .then(function (data) {
            return data;
        })
    }
}


co(function* () {

    var res = yield selectFrom('test');
    console.log(res);
    var file = yield readFile('file1');
    console.log(file.toString());

}).catch(function (error) {
    console.error(error);
});