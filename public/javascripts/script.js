//$scope.$apply(); use this to update the scope
app.controller('automate-ctrl', function($scope, $mdSidenav, $http, $mdDialog, $q, $timeout, $rest) {

    /********** INITIALIZING **********/

    /*
     * SERVER CLIENT
     */
    


    /*
     * TOOLBAR *
     */
    $scope.applicationName = 'AutoMate';
    $scope.moduleSelectorIsDisabled = true;
	$scope.statusBarColor = 'default-status';
    $scope.test = true;




    /********** OPTION MENU **********/
    $scope.openOptionMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };


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
            return 'Project : ' + $scope.selectedProject;
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
            return 'Module : ' + $scope.selectedModule._id;
        else
            return 'Select a module';
    };

    $scope.onModuleChange = function() {
        $scope.testcaseUpdate();
    };


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
    $scope.showStatus = function(status, message, timeout) {
		status ? $scope.statusBarColor = 'success-status'
					:$scope.statusBarColor = 'error-status';
		
		$scope.status = message;
		
		$timeout(function () {
			$scope.statusBarColor = 'default-status';
			$scope.status = '';
		}, timeout);
    };

    
    /********** UPDATERS **********/
	$scope.projectUpdate = function () {
		$rest.getAllProjects()
			.then(function (res) {
				let data = res.data;
				$scope.showStatus(data.status, '', 500);

				if(data.status)
					$scope.projects = data.body;
				else
					console.error(data.error);
			});
	};

	$scope.moduleUpdate = function () {
		if($scope.selectedProject !== undefined) {
			$rest.getAllModules({
                'projectName': $scope.selectedProject
            })
				.then(function (res) {
					let data = res.data;
					$scope.showStatus(data.status, '', 500);
					
					if(res.status)
						$scope.modules = data.body;
					else 
						console.error(error);
				});
		}
        else {
            $scope.showStatus(false, 'Select A Project', 1000);
        }
	};

	$scope.testcaseUpdate = function () {
        if($scope.selectedModule !== undefined) {
            $rest.getAllTestCases({
                'projectName': $scope.selectedProject,
                'id': $scope.selectedModule._id
            })
                .then(function (res) {
                    let data = res.data;
                    $scope.showStatus(data.status, '', 500);

                    if(data.status)
                        $scope.testcases = data.body;
                    else
                        console.error(data.error);
                });
        }
	};

    $scope.componentsUpdate = function () {
        if($scope.selectedTestCase !== undefined) {
            $rest.getAllComponents({
                'projectName': $scope.selectedProject,
                'id': $scope.selectedTestCase._id
            })
                .then(function (res) {
                    let data = res.data;
                    console.log(data);
                    $scope.showStatus(data.status, '', 500);

                    if(data.status) 
                        $scope.components = data.body;
                    else 
                        console.error(data.error);
                });
        }
    };

    $scope.selectTestCase = function (testcase) {
        $scope.selectedTestCase = testcase;
    };
});