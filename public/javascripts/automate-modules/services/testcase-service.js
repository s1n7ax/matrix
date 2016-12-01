app.service('$testcaseService', testcaseService);

function testcaseService ($superService, $restService) {
    angular.extend(testcaseService.prototype, $superService);

    this.dbRetrieve = function (selectedProjectName, callback) {
		let self = this;

		$restService.getAllTestcases({
			projectName: selectedProjectName
		})
			.then(function successCallback(res) {
				if(res.data.status) {
					console.log('\n');
					console.log('Getting all testcases - Successful!');
					console.log(res.data.val);
					self._list = res.data.val;
					if(callback)
					    callback();
				}
				else {
					console.error('Getting all testcases - Failed!');
                    console.log(res.data.error);
				}
			},
			function errorCallback(error) {
				console.error('Getting all testcases - Failed!');
                console.log(error);
			})
	}
};