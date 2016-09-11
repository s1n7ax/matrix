app.service('$rest', function($http) {

    this.deepProjectTreeUpdate = function(rid) {
        return $http.post('/deepProjectTreeUpdate', {'rid': rid})
    }

    this.getAllProjects = function() {
        return $http.post('/getAllProjects');
    }
}); 