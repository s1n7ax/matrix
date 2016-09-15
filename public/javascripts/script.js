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
			$rest.getAllModules()
				.then(function (res) {
					let data = res.data;
					$scope.showStatus(data.status, '', 500);
					
					if(res.status)
						$scope.modules = data.body;
					else 
						console.error(error);
				});
		}
	};

	$scope.testcaseUpdate = function () {
        if($scope.selectedModule !== undefined) {
            rest.deepSelectById($scope.selectedModule._id)
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
        if($scope.testcases !== undefined) {
            $rest.deepSelectById($scope.testcases._id)
                .then(function (res) {
                    let data = res.data;
                    $scope.showStatus(data.status, '', 500);

                    if(data.status) 
                        $scope.components = data.body;
                    else
                        console.error(data.error);
                })
        }
    };

    $scope.modules = [
        {_id: 'Core HR', type: 'module', links:['tc_CoreHR_001', 'tc_CoreHR_002']},
        {_id: 'Time Off', type: 'module', links:['tc_TimeOff_001', 'tc_TimeOff_002']}
    ]

    $scope.testcases = [
        {_id: 'tc_CoreHR_001', type: 'testcase', links: ['bc_CoreHR_001', 'bc_CoreHR_002']},
        {_id: 'tc_CoreHR_002', type: 'testcase', links: ['bc_CoreHR_001', 'bc_CoreHR_002']}
    ]

    $scope.components = [
        {_id: 'bc_CoreHR_001', type: 'component', content: 'type name'},
        {_id: 'bc_CoreHR_002', type: 'component', content: 'type passwd'}
    ]
});