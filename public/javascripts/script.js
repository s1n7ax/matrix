app.controller('automate-ctrl', function($scope, $mdSidenav, $http, $mdDialog, $q, $timeout, $rest) {

    /********** INITIALIZING **********/
    var self = this;

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



    $scope.project = new Object;
    $scope.project._projects = new Array
    $scope.project.get = function () {
        return this._projects;
    }
    
    $scope.project.set = function (value) {
        this._projects.push(values);
    }







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

                if (itemType === 'Project') {
                    $rest.createProject({
                        'projectName': result
                    }).then(
                        function successCallback(res) {
                            console.log(res);
                            (res.data.status) ?
                            $scope.showStatus(res.data.status,
                                    'Creating Project : Successful!', 2000): $scope.showStatus(
                                    res.data.status,
                                    'Creating Project : Failed!', 2000) &
                                console.error(res.data.error)
                        },
                        function errorCallback(error) {
                            $scope.showStatus(false, 'Creating Project : Failed!',
                                2000);
                            console.error(error);
                        });
                } else if (itemType === 'Module' && $scope.selectedProject !== undefined &&
                    $scope.selectedProject !== null) {
                    $rest.createModule({
                            'projectName': $scope.selectedProject,
                            'values': {
                                '_id': result,
                                'type': 'module'
                            }
                        })
                        .then(function successCallback(res) {
                            (res.data.status) ?
                            $scope.showStatus(res.data.status,
                                    'Creating Module : Successful!', 2000): console.error(
                                    res.data.error) &
                                $scope.showStatus(res.data.status,
                                    'Creating Module : Failed!', 2000)

                        }, function errorCallback(error) {
                            $scope.showStatus(false, 'Creating Module : Failed!',
                                2000);
                            console.error(error);
                        });
                } else if (itemType === 'TestCase' && $scope.selectedModule !== undefined &&
                    $scope.selectedModule !== null) {
                    $rest.createTestCase({
                            'projectName': $scope.selectedProject,
                            'module': $scope.selectedModule,
                            'values': {
                                '_id': result,
                                'type': 'testcase'
                            }
                        })
                        .then(function successCallback(res) {
                            (res.data.status) ?
                            $scope.showStatus(res.data.status,
                                    'Creating TestCase : Successful!', 2000): console
                                .error(res.data.error) &
                                $scope.showStatus(res.data.status,
                                    'Creating TestCase : Failed!', 2000)

                        }, function errorCallback(error) {
                            $scope.showStatus(false, 'Creating Module : Failed!',
                                2000);
                            console.error(error);
                        });
                }
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

    $scope.editor = CodeMirror.fromTextArea(textArea, {
        lineNumbers: true,
    });

    $scope.editor.setOption("extraKeys", {
        'Cmd-S': function(cm) {
            if ($scope.selectedComponent !== undefined) {
                console.log(cm.doc.getValue());

                let data = $scope.selectedComponent;
                data.content = cm.doc.getValue();

                $rest.setComponent({
                        'projetcName': $scope.selectedProject,
                        'values': data
                    })
                    .then(function(res) {
                        if (res.data.status) {
                            $scope.showStatus(true, 'Saving Component : Successful!',
                                5000);
                        } else {
                            $scope.showStatus(false, 'Saving Component : Failed!',
                                5000);
                        }
                    })
            }
        }
    });



    /********** STATUS BAR **********/
    $scope.showStatus = function(status, message, timeout) {
        status ? $scope.statusBarColor = 'success-status' :
            $scope.statusBarColor = 'error-status';

        $scope.status = message;

        $timeout(function() {
            $scope.statusBarColor = 'default-status';
            $scope.status = '';
        }, timeout);
    };


    /********** UPDATERS **********/
    $scope.projectUpdate = function() {
        $rest.getAllProjects()
            .then(function successCallback(res) {
                res.data.status ?
                    $scope.showStatus(res.data.status, 'Updating Project List : Successful!', 500) :
                    $scope.showStatus(res.data.status, 'Updating Project List : Failed!', 3000) &
                    console.error(error)

            }, function errorCallback(error) {
                $scope.showStatus(false, 'Updating Project List : Failed!', 3000);
                console.error(error);
            });
    };

    $scope.moduleUpdate = function() {
        if ($scope.selectedProject !== undefined) {
            $rest.getAllModules({
                    'projectName': $scope.selectedProject
                })
                .then(function(res) {
                    res.data.status ?
                        $scope.showStatus(res.data.status, 'Updating Module List : Successful!', 500) :
                        $scope.showStatus(res.data.status, 'Updating Module List : Failed!', 3000) &
                        console.error(error)

                }, function errorCallback(error) {
                    console.error(error);
                    $scope.showStatus(false, '', 500);
                });
        } else {
            $scope.showStatus(false, 'Select A Project', 1000);
        }
    };

    $scope.testcaseUpdate = function() {
        if ($scope.selectedModule !== undefined) {
            $rest.getAllTestCases({
                    'projectName': $scope.selectedProject,
                    'id': $scope.selectedModule._id
                })
                .then(function(res) {
                    let data = res.data;
                    $scope.showStatus(data.status, '', 500);

                    if (data.status)
                        $scope.testcases = data.body;
                    else
                        console.error(data.error);
                });
        }
    };

    $scope.componentsUpdate = function() {
        if ($scope.selectedTestCase !== undefined) {
            $rest.getAllComponents({
                    'projectName': $scope.selectedProject,
                    'id': $scope.selectedTestCase._id
                })
                .then(function(res) {
                    let data = res.data;
                    $scope.showStatus(data.status, '', 500);

                    if (data.status)
                        $scope.components = data.body;
                    else
                        console.error(data.error);
                });
        }
    };


    $scope.selectTestCase = function(testcase) {
        $scope.selectedTestCase = testcase;
    };

    $scope.setSelectedComponent = function(component) {
        $scope.selectedComponent = component;
    };

    $scope.setEditorContent = function() {
        if ($scope.selectedComponent.content !== null &&
            $scope.selectedComponent.content !== undefined)
            $scope.editor.setValue($scope.selectedComponent.content);
        else
            $scope.editor.setValue('');
    }


    $scope.openDialog = function($event) {
        $mdDialog.show({
            controller: DialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'dialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true
        });
    }


    function DialogCtrl($timeout, $q, $scope, $mdDialog) {
        var self = this;

        // list of `state` value/display objects
        self.states = loadAll();
        self.querySearch = querySearch;

        // ******************************
        // Template methods
        // ******************************

        self.cancel = function($event) {
            $mdDialog.cancel();
        };
        self.finish = function($event) {
            $mdDialog.hide();
        };

        // ******************************
        // Internal methods
        // ******************************

        /**
         * Search for states... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch(query) {
            return query ? self.states.filter(createFilterFor(query)) : self.states;
        }

        /**
         * Build `states` list of key/value pairs
         */
        function loadAll() {
            var allStates =
                'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

            return allStates.split(/, +/g).map(function(state) {
                return {
                    value: state.toLowerCase(),
                    display: state
                };
            });
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };

        }
    }

});