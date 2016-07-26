let OrientDB = require('orientjs');

let server = OrientDB({
  host: 'cmdsnmuhandiram',
  port: 2424,
  username: 'admin',
  password: 'admin'
});

let db = server.use('AutomateProjectDB')

db.class.get('test')
  .then(function (project) {
    console.log(project.name)
    console.log(project.superClass)

    project.list().then(function (data) {
      console.log(data.length);
    })

  })

