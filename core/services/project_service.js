const DAO = require('../db_accessors/dao');
const Service = require('./services');

class ProjectService extends Service {
    
    constructor() {
        super();
        this.database = new DAO('project');
    }
}


let a = new ProjectService();
a.add('newProject', {
  name:'hello world',
  age:25
},function (data) {
  console.log(data.status);
})
