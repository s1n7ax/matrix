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
            services: Path.join(__dirname, 'services', 'services'),
            newService: Path.join(__dirname, 'services', 'newService'),
            backup: Path.join(__dirname, 'services', 'backup')
        }

        this.routesPath = {
            index: Path.join(__dirname, 'routes', 'index'),
            users: Path.join(__dirname, 'routes', 'users')
        }

        this.viewsPath = {
            index: Path.join(__dirname, 'views', 'index.html'),
            reporter: Path.join(__dirname, 'views', 'reporter.html'),
            indexEJS: Path.join(__dirname, 'views', 'index')
        }
		
		this.commonPath = {
			user_exception: Path.join(__dirname, 'common', 'user_exception')
		}

		this.couchBackup = {
		    dbSource: Path.join('C:\\Program Files (x86)\\Apache Software Foundation\\CouchDB\\var\\lib\\couchdb'),
		    dbCopyTo: Path.join(__dirname, 'backup')
		}
    }
}

module.exports = new Locator;