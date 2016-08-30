let app = angular.module('automate', []);

app.service('services', function ($http, $scope) {
	this.getItems = function (itemType) {
		$http({
			method: 'POST',
			url: '/getItems'
		}).then (function successCallBack (res) {
			console.log(itemType);
		}, function errorCallBack (error) {
			console.error(error);
		})
	}
});