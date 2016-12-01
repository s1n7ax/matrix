const Locator = require('../locator');
const Service =  require(Locator.servicesPath.services);

class Reporter {
    constructor(project) {
        if(!project)
            throw 'No Project Name Provided';

        this.service = new Service(project, false);

        this.components;
        this.testcases;

        this.componentMap;
        this.componentNameList;
        this.testcaseMap;

        this.setData();
    }

    logger (customMsg, actualError) {
        if(!actualError) {
            console.log('\n');
            console.log('********************************');
            console.error(customMsg);
            console.log('********************************');
        }
        else {
            console.log('\n');
            console.log('********************************');
            console.error(customMsg);
            console.log('Actual Error : ');
            console.error(actualError);
            console.log('********************************');
        }
    }

    setData (callback) {
        let self = this;

        self.components = self.service.getAllComponentDocs(function (error, body) {
            if(error){
                self.logger('Getting All Testcases - Failed!', error);
            }
            else{
                self.logger('Getting All Testcases - Successful!');
                let result;
                console.log(body);
            }
        });
    }
}

let a = new Reporter('eag_velocity');