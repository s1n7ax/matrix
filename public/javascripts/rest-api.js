app.service('$rest', function($http) {
	
  
  this.getItems = function ($scope, data) {
    
    if(data.itemType == 'Project') {
      return $http.post('/getItems', data)
    }
    else if(data.itemType == 'Module') {
      
      data.itemType = 'ProjectModule';
      data.itemRIDs = $scope.selectedProject.subclass_links
      return $http.post('/getItemsByRIDs', data);
    }
    
      
  }
  
  this.createItem = function ($scope, data) {
    
  	if(data.itemType == 'Project') {

  		data.itemType = 'Project';
  		return $http.post('/createItem', data);
  	}
  	else if(data.itemType == 'Module' && $scope.selectedProject !== undefined) {
  		
  		data.itemType = 'ProjectModule';
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