//$scope.$apply(); use this to update the scope

var projectName;
var moduleName;


app.controller('automate-ctrl', function ($scope, $mdSidenav, $http, $mdDialog, $rest) {

      /********** TOOLBAR **********/
      $scope.applicationName = 'AutoMate';



      /********** OPTION MENU **********/
      $scope.openOptionMenu = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
      }

      /********** OPTION MENU -> CREATE PROJECT **********/
      $scope.inputPrompt = function (itemType, ev) {
        var config = $mdDialog.prompt()
          .title(`Enter ${itemType} Name`)
          .textContent(itemType + ' name should be unique')
          .placeholder(itemType + 'Name')
          .ariaLabel(itemType + ' Name')
          .initialValue('')
          .targetEvent(ev)
          .disableParentScroll(true)
          .clickOutsideToClose(true)
          .ok('Okay')
          .cancel('Cancel');

        $mdDialog.show(config).then(function (result) {
          
          $rest.createItem().then(
            function successCallback (data) {
              console.log(data.data);
            },
            function errorCallback (error) {
              console.error(error) ;
            }
          ); 
        });
      }



      /********** TOOLBAR SELECT PROJECT **********/
      $scope.moduleSelectorIsDisabled = true;

      $scope.getProjects = function () {
        $rest.getItems('Project').then(
          function successCallback (data) {
            $scope.projects = data.data;
          },
          function errorCallback (error) {
            console.error(error);
          }
        );
      }

      $scope.getSelectedProject = function () {
        
        if ($scope.selectedProject !== undefined && $scope.selectedProject !== null) {
          
          $scope.moduleSelectorIsEnabled = false;
          return 'Project : ' + $scope.selectedProject.name;
        } 
        else {
          
          $scope.moduleSelectorIsEnabled = true;
          return 'Select a project';
        }
      };

      /********** TOOLBAR SELECT MODULE **********/
      $scope.getModules = function () {
        if ($scope.selectedProject !== undefined && $scope.selectedProject !== null) {
          
          $rest.getItems('ProjectModule').then(
            function successCallback (data) {
              $scope.modules = data.data;
            }, 
            function errorCallback (error) {
              console.error(error);
          });
        }
      };

      $scope.getSelectedModule = function () {
        if ($scope.selectedModule !== undefined && $scope.selectedModule !== null)
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
    })