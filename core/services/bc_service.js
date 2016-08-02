const Service = require('./services');

class BCService extends Service {
    
    constructor() {
        super();
        this.database = new DAO('bc');
    }
}


module.exports = new BCService;