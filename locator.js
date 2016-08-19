const Path = require('path');

class Locator {
    constructor() {

        this.applicationPath = Path.join(__dirname);
        
        this.dbManagersPath = {
            dao: Path.join(__dirname, 'db_managers', 'dao')
        }

        this.configurationPath = {
            database_conf: Path.join(__dirname, 'configurations', 'database.conf.json')
        }

        this.servicesPath = {
            services: Path.join(__dirname, 'services', 'services')
        }

        this.routesPath = {
            index: Path.join(__dirname, 'routes', 'index'),
            users: Path.join(__dirname, 'routes', 'users')
        }

        this.viewsPath = {
            index: Path.join(__dirname, 'views', 'index.html')
        }
		
		this.commonPath = {
			user_exception: Path.join(__dirname, 'common', 'user_exception')
		}
    }
}

module.exports = new Locator;