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



    this.createProject = function (projectName) {
        return $http.post('/createProject', projectName);
    }

    this.createModule = function (values) {
        return $http.post('/createModule', values);
    }

    this.createTestCase = function (values) {
        return $http.post('/createTestCase', values);
    } 


    this.setComponent = function (values) {
        return $http.post('/setComponent', values)
    }
}); 