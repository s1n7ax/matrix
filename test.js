var OrientDB = require('orientjs');

var server = OrientDB({
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   'root'
});


var db = server.use({
   name: 'AutomateProjectDB'
});



for(let i =0; i<1000;i++){
	db.query('insert into Project set name=true')
	.then(function(data) {
		console.log(data);
	})
	.then(function () {
		process.exit();
	})
}

name links order 
