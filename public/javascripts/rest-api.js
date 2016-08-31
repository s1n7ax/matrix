app.service('$rest', function($http) {
	
  
  this.getItems = function (data) {
    return $http.post('/getItems', data)
  }
  
  this.createItem = function (data) {
    return $http.post('/createItem', data)
  }
}); 