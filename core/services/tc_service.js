const Service = require('./services');

class TCService extends Service {
    
    constructor() {
        super();
        this.database = new DAO('tc');
    }
}


module.exports = new TCService;