
const Locator = require('../locator');
const DAO = require(Locator.dbManagersPath.dao);



class Services {

    constructor(itemType) {
        this.database = new DAO;
        this.itemType = itemType;
    }

    create(self, values, response) {
        let responseObj = {
            'status': null,
            'error': null,
            'data': null
        }

        self.database.selectDoc(self.itemType, {'name': values.name}).then(function(data) {
            
            if(data.length > 0){
                throw new Error({
                    'name': 'RecordAlreadyExist',
                    'messgae': 'Item: '+values.name+' already exist in the database'
                });
            }else{
                self.database.insertDoc(self.itemType, values).then(function(data) {
                    responseObj = {
                        'status': true,
                        'error': false,
                        'data': data
                    };
                });
            }
        }).catch(function(error) {
            responseObj = {
                'status': false,
                'error': JSON.stringify(error),
                'data': null
            }
        }).finally(function () {
            response.send(responseObj);
        });
    }
}

module.exports = Services;