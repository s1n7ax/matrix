const Service = require('./services');

class ProjectService extends Service {
    
    constructor() {
        super();
        this.database = new DAO('project');
    }
}


module.exports = new ProjectService;