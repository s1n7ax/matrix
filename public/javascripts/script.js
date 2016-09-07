//$scope.$apply(); use this to update the scope

app.controller('automate-ctrl', function ($scope, $mdSidenav, $http, $mdDialog, $q, $rest) {

      /********** INITIALIZING **********/

      /*
       * TOOLBAR *
       */
      $scope.applicationName = 'AutoMate';

      $scope.Project = new Array;
      $scope.Module = new Array;
      $scope.TestCase = new Array;
      $scope.Component = new Array;

      $scope.moduleSelectorIsDisabled = true;

      


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
                console.log(res.data.data);
                $scope.deepProjectUpdate();
              },
              function errorCallback (error) {
                console.error(error);
              });
          }
        });
      };


      /********** TOOLBAR SELECT PROJECT **********/
      $scope.getSelectedProject = function () {
        
        if ($scope.selectedProject !== undefined && $scope.selectedProject !== null) {

          $scope.moduleSelectorIsDisabled = false;
          return 'Project : ' + $scope.selectedProject.name;
        } 
        else {

          $scope.moduleSelectorIsDisabled = true;
          return 'Select a project';
        }
      };
  
      $scope.onProjectChange = function () {
        $scope.selectedModule = undefined;
        $scope.selectedTestCase = undefined;
        $scope.selectedComponent = undefined;
      };

      
      /********** TOOLBAR SELECT MODULE **********/
      $scope.getSelectedModule = function () {
        
        if ($scope.selectedModule !== undefined && $scope.selectedModule !== null)
          return 'Module : ' + $scope.selectedModule.name;
        else
          return 'Select a module';
      };

      $scope.onModuleChange = function () {
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
      $scope.deepProjectUpdate = function () {

        $scope.Project = new Array;
        $scope.Module = new Array;
        $scope.TestCase = new Array;
        $scope.Component = new Array;

        $http.post('/getAllItems', {'itemType': 'Project'})
        .then(function successCallback (res) {
          $scope.Project = res.data.data;

        }, function errorCallback(error) {
          console.error(error);
        })
        .then(function () {

          console.log('selectedProject is :');
          console.log($scope.selectedProject);
          if($scope.selectedProject !== undefined 
            && $scope.selectedProject !== null
            && $scope.selectedProject.subclass_links !== undefined) {
            $scope.projectItemUpdate($scope.selectedProject.subclass_links);
          }
        })
      }

      $scope.projectItemUpdate = function (itemRIDs) {
        $http.post('/getItemsByRIDs', {'itemRIDs': itemRIDs})
        .then(function successCallback(res) {
          res.data.data.forEach(function (data) {
            $scope[data['@class']].push(data);
            $scope.selectedItemUpdate(data);
          });

          
        }, function errorCallback(error) {
          console.error(error);
        });
      }

      $scope.selectedItemUpdate = function (data) {
        if($scope['selected'+data['@class']] !== undefined
          && $scope['selected'+data['@class']] !== null
          && $scope['selected'+data['@class']]['@rid'] === data['@rid']) {

          $scope['selected'+data['@class']] = data;
          
          if($scope['selected'+data['@class']].subclass_links !== undefined){
            $scope.projectItemUpdate($scope['selected'+data['@class']].subclass_links);
          }
        }
      }


    });