app.service('$rest', function($http) {
    
    this.getAllProjects = function() {
        return $http.post('/getAllProjects');
    }

    this.getAllModules = function (projectName) {
        return $http.post('/getAllModules', projectName);
    }

    this.getAllTestCases = function (values) {
        return $http.post('/getAllTestCases', values);
    }

    this.getAllComponents = function (values) {
        return $http.post('/getAllComponents', values);
    }
}); 