const Locator = require('../locator');
const DAO = require(Locator.dbManagersPath.dao);



class Services {

	constructor (itemType) {
		this.database = new DAO;
		this.itemType = itemType;
	}

	create (self, values, response) {

		self.database.selectDocBy(self.itemType, {
			'name': values.name
		}).then(function (data) {

			if (data.length > 0) {
				throw {
					name: 'ItemAlreadyExist',
					message: 'The item you are trying to cteate, is already exist in the database'
				};
			} else {
				
				self.database.insertDoc(self.itemType, values).then(function (data) {
					response.send({
						'status': true,
						'error': false,
						'data': data
					});
				});
			}
		}).catch(function (error) {
			response.send({
				'status': false,
				'error': error,
				'data': null
			});
		});
	}

	getItems (self, response) {
		self.database.selectDocs(self.itemType).then(function (data) {
			if(data.length < 1) {
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
		}).catch(function (error) {
			response.send({
				'status': false,
				'error': error,
				'data': null
			});
		})
	}
}



module.exports = Services;