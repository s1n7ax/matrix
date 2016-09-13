//$scope.$apply(); use this to update the scope
app.controller('automate-ctrl', function($scope, $mdSidenav, $http, $mdDialog, $q, $rest) {

    /********** INITIALIZING **********/

    /*
     * SERVER CLIENT
     */
    


    /*
     * TOOLBAR *
     */
    $scope.applicationName = 'AutoMate';
    $scope.moduleSelectorIsDisabled = true;




    /********** OPTION MENU **********/
    $scope.openOptionMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    }


    /********** OPTION MENU -> CREATE ITEMS **********/
    $scope.inputPrompt = function(itemType, ev) {
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

        $mdDialog.show(config).then(function(result) {
            if (result !== null && result !== undefined) {
                $rest.createItem($scope, {
                    'itemType': itemType,
                    'name': result
                }).then(
                    function successCallback(res) {

                    },
                    function errorCallback(error) {
                        console.error(error);
                    });
            }
        });
    };


    /********** TOOLBAR SELECT PROJECT **********/
    $scope.getSelectedProject = function() {

        if ($scope.selectedProject !== undefined && $scope.selectedProject !== null) {

            $scope.moduleSelectorIsDisabled = false;
            return 'Project : ' + $scope.selectedProject.name;
        } else {

            $scope.moduleSelectorIsDisabled = true;
            return 'Select a project';
        }
    };

    $scope.onProjectChange = function() {
        $scope.selectedModule = undefined;
        $scope.selectedTestCase = undefined;
        $scope.selectedComponent = undefined;
    };


    /********** TOOLBAR SELECT MODULE **********/
    $scope.getSelectedModule = function() {

        if ($scope.selectedModule !== undefined && $scope.selectedModule !== null)
            return 'Module : ' + $scope.selectedModule.name;
        else
            return 'Select a module';
    };

    $scope.onModuleChange = function() {};


    /********** SIDE NAVIGATOR **********/
    $scope.toggleNav = buildToggle('side-nav');

    function buildToggle(componentID) {
        return function() {
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


    /********** STATUS BAR **********/
    $scope.showStatus = function(status, name, message) {
        $scope.statusBar.status = status;
        $scope.statusBar.name = name;
        $scope.statusBar.message = message;
    }

    
    /********** UPDATERS **********/
    $scope.deepProjectUpdate = function () {
        $rest.getAllProjects()
            .then(function successCallback(res) {
				console.log(res);
                $scope.projects = res.data.body;

                if($scope.selectedProject !== undefined) {

                    $rest.deepProjectTreeUpdate($scope.selectedProject['@rid'])
                    .then(function successCallback(res) {
                        $scope.projectTree = res.data.data;
                        console.log('*************');
                        console.log(res.data.data);
                    }, function errorCallback(error) {
                        console.error(error);
                    })
                    .then(function () {
                        
                        $scope.updateModuleList();
                        $scope.updateTestCaseList();
                        $scope.updateComponentList();
                    });
                }

            }, function errorCallback(error) {
                console.error(error);
            })
    }

    $scope.updateModuleList = function() {
        if($scope.selectedProject !== undefined
            && $scope.selectedProject !== null) {

            if($scope.selectedProject['@rid'] === $scope.projectTree['@rid']) {
                $scope.modules = $scope.projectTree.subclass_links;
            }
            else {
                $scope.selectedProject = undefined;
                $scope.projects = undefined;
            }
        }  
    }

    $scope.updateTestCaseList = function() {
        if($scope.selectedModule !== undefined
            && $scope.selectedModule !== null) {

            let oldSelectedModuleRID = $scope.selectedModule['@rid'];
            let newSelectedModule = $scope.modules.filter(result=>result['@rid'] === oldSelectedModuleRID);
            
            if(newSelectedModule.length === 1
                && newSelectedModule.subclass_links !== undefined
                && newSelectedModule.subclass_links !== null) {
                $scope.testCases = newSelectedModule[0].subclass_links;
            }
            else {
                $scope.selectedTestCase = undefined;
                $scope.selectedComponent = undefined;

                $scope.testCases = undefined;
                $scope.components = undefined;
            }
        }
    }

    $scope.updateComponentList = function() {
        if($scope.selectedTestCase !== undefined
            && $scope.selectedTestCase !== null) {

            let oldSelectedTestCaseRID = $scope.selectedTestCase['@rid'];
            let newSelectedTestCase = $scope.testCases.filter(result=>result['@rid'] === oldSelectedTestCaseRID);

            if(newSelectedTestCase.length === 1
                && newSelectedTestCase.subclass_links !== undefined
                && newSelectedTestCase.subclass_links !== null) {
                $scope.components = newSelectedTestCase[0].subclass_links;
            }
            else {
                $scope.selectedComponent =undefined;
                $scope.components = undefined;
            }
        }
    }
});