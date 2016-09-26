app.service('$rest', function($http) {

    let self = this;
    
    self.getAllProjects = function() {
        return $http.post('/getAllProjects');
    };

    self.getAllModules = function (projectName) {
        return $http.post('/getAllModules', projectName);
    };

    self.getAllTestCases = function (values) {
        return $http.post('/getAllTestCases', values);
    };

    self.getAllComponents = function (values) {
        return $http.post('/getAllComponents', values);
    };




    self.createProject = function (values) {
        return $http.post('/createProject', values);
    };

    self.createModule = function (values) {
        return $http.post('/createModule', values);
    };

    self.createTestCase = function (values) {
        return $http.post('/createTestCase', values);
    } 


    self.setComponent = function (values) {
        return $http.post('/setComponent', values);
    };
}); 