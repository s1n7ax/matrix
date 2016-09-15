app.service('$rest', function($http) {
    this.getAllProjects = function() {
        return $http.post('/getAllProjects');
    }
}); 