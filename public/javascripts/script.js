//$scope.$apply(); use this to update the scope

var projectName;
var moduleName;


//angular.module('automate', ['ngMaterial', 'ngMessages'])
  app.controller('automate-ctrl', function ($scope, $mdSidenav, $http, $mdDialog, test) {

    /********** TOOLBAR **********/
    $scope.applicationName = 'AutoMate';



    /********** OPTION MENU **********/
    $scope.openOptionMenu = function ($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    }

    /********** OPTION MENU -> CREATE PROJECT **********/
    $scope.inputPrompt = function (itemName, ev) {

      var config = $mdDialog.prompt()
        .title(`Enter ${itemName} Name`)
        .textContent(itemName + ' name should be unique')
        .placeholder(itemName + 'Name')
        .ariaLabel(itemName + ' Name')
        .initialValue('')
        .targetEvent(ev)
        .disableParentScroll(true)
        .clickOutsideToClose(true)
        .ok('Okay')
        .cancel('Cancel');

      $mdDialog.show(config).then(function (result) {
        
        $http({
          method: 'POST',
          url: '/createProject',
          data: {name: result}
        })
        .then(function successCallBack(res) {
          console.log(res);
        }, function errorCallBack(error) {
          console.error(error);
        });
      });


    }



    /********** TOOLBAR SELECT PROJECT **********/
    $scope.moduleSelectorIsEnabled = true;

    $scope.getProjectNames = function () {
      $http({
        method: 'POST',
        url: '/getProjects'
      })
        .then(function successCallBack(res) {
          $scope.projects = res.data.data;
        }, function errorCallBack(error) {
          console.error(error);
        })
    };

    $scope.getSelectedProject = function () {
      if ($scope.selectedProject !== undefined) {
        $scope.moduleSelectorIsEnabled = false;
        return 'Project : ' + $scope.selectedProject.name;
      } else
        return 'Select a project';
    };

    /********** TOOLBAR SELECT MODULE **********/
    $scope.getModules = function () {
      if ($scope.selectedProject !== undefined && $scope.selectedProject !== null) {
        $http({
          method: 'POST',
          url: '/getModules'
        }).then(function successCallBack(res) {

          console.log(res.data);
            $scope.modules = res.data.data;
          }, function errorCallBack(error) {
            console.error(error);
        });
      }
    };

    $scope.getSelectedModule = function () {
      if ($scope.selectedModule !== undefined)
        return 'Module : ' + $scope.selectedModule.name;
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
	
		test.myFunc($scope);
		console.log($scope.test);

  });
