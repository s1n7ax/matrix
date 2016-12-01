app.service('$testsuiteService', testsuiteService)

function testsuiteService ($superService, $restService) {
	angular.extend(testsuiteService.prototype, $superService);

	this.dbRetrieve = function (selectedProjectName, callback) {
		let self = this;

		$restService.getAllTestsuites({
			projectName: selectedProjectName
		})
			.then(function successCallback(res) {
				if(res.data.status) {
					console.log('\n');
					console.log('Getting all Test Suites - Successful!');
					console.log(res.data.val);
					self._list = res.data.val;
					if(callback)
					    callback()
				}
				else {
					console.error('Getting Test Suites - Failed!');
                    console.log(res.data.error);
				}
			},
			function errorCallback(error) {
				console.error('Getting all Test Suites - Failed!');
                console.log(error);
			});
	}
};

