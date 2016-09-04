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
		}).then (function (data) {

			if (!data.length > 0)
				
				self.database.insertDoc(self.itemType, values.name)
				.then(function (data) {

					if (data['@class'] == 'Project') {
						response.send({
							'status': true,
							'error': false,
							'data': data
						});
					}
					else if (data['@class'] == 'ProjectModule') {
						
					}

				}

		}).catch (function (error) {

		}) 
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