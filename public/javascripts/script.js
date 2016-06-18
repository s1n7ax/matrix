//$scope.$apply(); use this to update the scope

var gl = 'hello';
var projectName;
var moduleName;


angular.module('automate', ['ngMaterial'])
  .controller('automate-ctrl', function ($scope, $mdSidenav, $http) {

    /********** TOOLBAR **********/
    $scope.applicationName = 'AutoMate';






    /********** TOOLBAR SELECT PROJECT **********/
    $scope.moduleSelectorIsEnabled = true;

    $scope.getProjectNames = function () {
      $http({
        method: 'POST',
        url: '/getProjectNames'
      })
        .then(function successCallBack(res) {
          $scope.projects = res.data;
        }, function errorCallBack(error) {
          console.error(error);
        })
    };

    $scope.getSelectedProject = function () {
      if ($scope.selectedProject !== undefined){
        console.log(gl);
        $scope.moduleSelectorIsEnabled = false;
        return 'Project : ' + $scope.selectedProject;
      }
      else
        return 'Select a project';
    };






    /********** TOOLBAR SELECT MODULE **********/
    $scope.modules = ['Core HR', 'Core Finance', 'Velocity Travel', 'Time Off'];
    $scope.selectedModule;
    $scope.getSelectedModule = function () {
      if ($scope.selectedModule !== undefined)
        return 'Module : ' + $scope.selectedModule;
      else
        return 'Select a module';
    };

    /********** SIDE NAVIGATOR **********/
    $scope.toggleNav = buildToggle('side-nav');

    function buildToggle(componentID) {
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