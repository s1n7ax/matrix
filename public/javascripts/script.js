//$scope.$apply(); use this to update the scope

angular.module('automate', ['ngMaterial'])
.controller('automate-ctrl', function ($scope, $mdSidenav, $http) {
  
  /********** TOOLBAR **********/
  $scope.applicationName = 'AutoMate';
  
  
  
  
  
  
  /********** TOOLBAR SELECT PROJECT **********/
  $scope.projects;
  $scope.selectedProject;
  
  $scope.getProjectNames = function () {
    $http({
      method: 'POST',
      url: '/getProjectNames'
    })
    .then(function successCallBack (data) {
      $scope.projects = data;
    }, function errorCallBack (error) {
      console.error(error);
    })
  };
  
  $scope.getSelectedProject = function () {
    if($scope.selectedProject !== undefined)
      return 'Project : ' + $scope.selectedProject;
    else
      return 'Select a project';
  };
  
  
  
  
  
  
  /********** TOOLBAR SELECT MODULE **********/
  $scope.modules = ['Core HR', 'Core Finance', 'Velocity Travel', 'Time Off'];
  $scope.selectedModule;
  $scope.getSelectedModule = function () {
    if($scope.selectedModule !== undefined)
      return 'Module : ' + $scope.selectedModule;
    else
      return 'Select a module';
  };
  
  /********** SIDE NAVIGATOR **********/
  $scope.toggleNav = buildToggle('side-nav');
  
  function buildToggle (componentID) {
    return function () {
      $mdSidenav(componentID).toggle();
    }
  }
  
  
  /********** SIDE NAVIGATOR BAR **********/
  $scope.selectedViewType = 'module-view';
  
  
  
  
  /********** EDITOR **********/
  var textArea = document.getElementById('textArea');
  
  CodeMirror.fromTextArea(textArea, {
    lineNumbers: true
  });
  
});