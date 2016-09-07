const Locator = require('../locator');
const DAO = require(Locator.dbManagersPath.dao);
class Services {
    constructor(itemType) {
        this.database = new DAO;
        this.itemType = itemType;
    }
    create(self, selectedItemRID, values, response) {
        self.database.selectDocsBy(self.itemType, {
            'name': values.name
        }).then(function(data) {
            if (!data.length > 0) {
                self.database.insertDoc(self.itemType, values).then(function(data) {
                    if (data['@class'] == 'Module' || data['@class'] == 'TestCase' || data['@class'] == 'Component') {
                        self.database.insertLink(selectedItemRID, data['@rid'])
                        .then(function (data) {
                            console.log('******************')
                            console.log(data);
                        })
                        .catch(function (error) {
                            console.error(error);
                        })
                    }
                });
            }
            return data;
        }).then(function(data) {
            response.send({
                'status': true,
                'data': data,
                'error': false
            });
        }).catch(function(error) {
            response.send({
                'status': false,
                'error': error,
                'data': null
            })
        });
    }
    getItems(self, response) {
        self.database.selectDocs(self.itemType).then(function(data) {
            if (data.length < 1) {
                throw {
                    name: 'NoItemsFound',
                    message: 'No items found in the database'
                }
            } else {
                response.send({
                    'status': true,
                    'error': false,
                    'data': data
                });
            }
        }).catch(function(error) {
            response.send({
                'status': false,
                'error': error,
                'data': null
            });
        })
    }
    getItemsByRIDs(self, data, response) {
        self.database.selectDocsByRIDs(data).then(function(data) {
            response.send({
                'status': true,
                'error': false,
                'data': data
            });
        }).catch(function(error) {
            response.send({
                'status': false,
                'error': error,
                'data': null
            });
        })
    }
}
module.exports = Services;
