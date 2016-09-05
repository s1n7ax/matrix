//$scope.$apply(); use this to update the scope

app.controller('automate-ctrl', function ($scope, $mdSidenav, $http, $mdDialog, $rest) {

      /********** TOOLBAR **********/
      $scope.applicationName = 'AutoMate';


      /********** OPTION MENU **********/
      $scope.openOptionMenu = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
      }

      
      /********** OPTION MENU -> CREATE ITEMS **********/
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
          if(result !== null && result !== undefined){
              $rest.createItem($scope, {
              'itemType': itemType,
              'name': result
              }).then(
              function successCallback (res) {
                $scope.getProjects();
              },
              function errorCallback (error) {
                console.error(error);
              });
          }
        });
      };


      /********** TOOLBAR SELECT PROJECT **********/
      $scope.moduleSelectorIsDisabled = true;

      $scope.getProjects = function () {
        
        $rest.getItems($scope, {
          'itemType': 'Project'
        }).then(
          function successCallback (res) {
            console.log(res.data.data);
            $scope.projects = res.data.data;
          },
          function errorCallback (error) {
            console.error(error);
          }
        );
      };

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
  
      $scope.onProjectUpdate = function () {
        $scope.selectedModule = null
        console.log($scope.selectedProject.subclass_links)
      };

      
      /********** TOOLBAR SELECT MODULE **********/
      $scope.getModules = function () {
        if ($scope.selectedProject !== undefined && $scope.selectedProject !== null) {
          
          $rest.getItems($scope, {'itemType': 'Module'}).then(
            function successCallback (res) {
              $scope.modules = res.data.data;
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

      $scope.onModuletUpdate = function () {
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


      /********** UPDATERS **********/
      $scope.selectedProjectUpdater = function () {
        
        console.log('\n-----------------------------------------------------------');
        console.log('*****Updating Selected Project - Inprogress*****');
        
        if($scope.selectedProject !== null && $scope.selectedProject !== undefined){

          $scope.selectedProject = $scope.projects.filter(result=>result['@rid'] == $scope.selectedProject['@rid'])[0];
          
          console.log('*****Updating Selected Project - Successful*****');
          console.log('#Selected Project is ');
          console.log($scope.selectedProject);
        }
        else{
          console.log('*****Updating Selected Project - Stopped*****')
          console.log('#Selected Project Is Null Or Undefined');
        }
        console.log('-----------------------------------------------------------\n');
      }



    })