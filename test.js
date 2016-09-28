var a = ['tc1', 'tc2'];

let tree = [{
	name: 'tc1',
	links: ['bc1', 'bc2']
}, {
	name: 'tc2'
}];

tree.forEach(function (e, index) {
	if(e.links !== undefined) {
		tree[]
	}
})







var services = new Object();

service.dbConf = null;
service.connectionQuery = null;
service.server =  null;

service.configure = function () {
    service.dbConf = JsonFile.readFileSync(Locator.configurationPath.database_conf);
    service.connectionQuery = `http://${dbConf.username}:${dbConf.password}@${dbConf.host}:${dbConf.port}`;
    service.server = Nano(service.connectionQuery);
}

service.getDatabase = function (dbName) {
    return service.server.use(dbName);
}



io.on('connection', function (socket) {
  io.emit('connected', 'Connecting to socket : Successful!');

  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });
});
