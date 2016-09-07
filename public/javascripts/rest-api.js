app.service('$rest', function($http) {
  
  this.createItem = function ($scope, data) {
    
  	if(data.itemType == 'Project') {

  		data.itemType = 'Project';
  		return $http.post('/createItem', data);
  	}
  	else if(data.itemType == 'Module' && $scope.selectedProject !== undefined) {

      console.log('$$$$$$$$$$$$$$$$$$$$$$$$')
  		
  		data.itemType = 'Module';
  		data.selectedItemRID = $scope.selectedProject['@rid'];
  		return $http.post('/createItem', data);
  	}
  	else if(data.itemType == 'Test Case' && $scope.selectedModule !== undefined) {

  		data.itemType = 'ProjectTC';
  		data.selectedItemRID = $scope.selectedModule['@rid'];
  		return $http.post('/createItem', data);
  	}
  	else if(data.itemType == 'Component' && $scope.selectedTC !== undefined) {
  		
  		data.itemType = 'ProjectBC';
  		data.selectedItemRID = $scope.selectedTC['@rid'];
  		return $http.post('/createItem', data);
  	}
    else {
      throw {
        name: 'SelectSubItem',
        message: `Please select a sub item of the ${data.itemType}`
      }
    }
  }
}); 