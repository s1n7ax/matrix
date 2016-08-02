const Service = require('./services');

class ModuleService extends Service {
    
    constructor() {
        super();
        this.database = new DAO('module');
    }
}


module.exports = new ModuleService;