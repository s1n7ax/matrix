app.service('$componentService', componentService);

function componentService ($superService, $restService) {

	"use strict";

    angular.extend(componentService.prototype, $superService);

    this.dbRetrieve = function (selectedProjectName, callback) {
    	let self = this;

		$restService.getAllComponents({
				projectName: selectedProjectName
			})
				.then(function successCallback(res) {
					if(res.data.status) {
						console.log('\n');
						console.log('Getting all components - Successful!');
						console.log(res.data.val);
						self._list = res.data.val;
						if(callback)
						    callback();
					}
					else {
						console.error('Getting all components - Failed!');
		                console.log(res.data.error);
					}
				},
				function errorCallback(error) {
					console.error('Getting all components - Failed!');
		            console.log(error);
				});
	}
};