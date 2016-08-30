app.service('$rest', function($http) {
	
  
  this.getItems = function (itemType) {
    return $http.post('/getItems', itemType)
  }
  
  this.createItem = function (itemType) {
    retunr $http.post('/createItem', itemType)
  }
}); 