app.service('$rest', function($http) {
	
  
  this.getItems = function (data) {
    return $http.post('/getItems', data)
  }
  
  this.createItem = function ($scope, data) {

  	if(data.itemType == 'Project') {

  		data.itemType = 'Project';
  		return $http.post('/createItem', data);
  	}
  	else if(data.itemType == 'Module') {
  		
  		data.itemType = 'ProjectModule';
  		data.selectedProjectRID = $scope.selectedProject['@rid'];
  		return $http.post('/createItem', data);
  	}
  	else if(data.itemType == 'Test Case') {

  		data.itemType = 'ProjectTC';
  		//data.selectedProjectRID = $scope.selectedProject['@rid'];
  		data.selectedModuleRID = $scope.selectedModule['@rid'];
  		return $http.post('/createItem', data);
  	}
  	else if(data.itemType == 'Component') {
  		
  		data.itemType = 'ProjectBC';
  		//data.selectedProjectRID = $scope.selectedProject['@rid'];
  		//data.selectedModuleRID = $scope.selectedModule['@rid'];
  		data.selectedTCRID = $scope.selectedTC['@rid'];
  		return $http.post('/createItem', data);
  	}
  }
}); 