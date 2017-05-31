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
            backup: Path.join(__dirname, 'services', 'backup'),
            writeExcel: Path.join(__dirname, 'services', 'write_excel'),
            readExcel: Path.join(__dirname, 'services', 'read_excel')
        }

        this.routesPath = {
            index: Path.join(__dirname, 'routes', 'index'),
            users: Path.join(__dirname, 'routes', 'users')
        }

        this.viewsPath = {
            index: Path.join(__dirname, 'views', 'index.html'),
            reporter: Path.join(__dirname, 'views', 'reporter.html'),
            indexEJS: Path.join(__dirname, 'views', 'index'),
            upload: Path.join(__dirname, 'views', 'upload.html')
        }

		this.commonPath = {
			user_exception: Path.join(__dirname, 'common', 'user_exception')
		}

		this.couchBackup = {
		    dbSource: Path.join('C:\\CouchDB\\data'),
		    dbCopyTo: Path.join(__dirname, 'backup')
		}

        this.temp = {
            temp: Path.join(__dirname, 'public', 'temp')
        }
    }
}

module.exports = new Locator;
