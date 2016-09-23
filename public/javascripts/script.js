app.controller('automate_ctrl', function($scope, $mdSidenav, $http, $mdDialog, $q, $timeout, $rest) {

    /********** INITIALIZING **********/
    var test = this;


    /**
     * CONSTRUCTOR
     */
     let constructor = function () {
        $scope.project.update();
     }


    /**
    * WATCHERS
    */
    $scope.$watch('selectedModule', function () {
        $scope.module.getModuleViewTree();
    });



    /**
     * TOOLBAR
     */
    $scope.applicationName = 'AutoMate';
    $scope.moduleSelectorIsDisabled = true;
    $scope.statusBarColor = 'default-status';


    /**
     * PROJECTS
     */
    $scope.projects = new Array;
    $scope.selectedProject = null;
    $scope.project = new Object;
    $scope.project.add = function (value) { $scope.projects.push(value) };
    $scope.project.getNames = function () {
        let data = new Array();
        $scope.projects.forEach(function (value, index) {
            data.push({
                'display': value,
                'value': value
            });
        });

        return data;
    };
    $scope.project.update = function () {
        $rest.getAllProjects()
            .then(function successCallback (res) {

                if(res.data.status) {
                    $scope.showStatus(res.data.status, 'Updating Project List : Successful!', 500);
                    $scope.projects = res.data.body;
                }
                else {
                    $scope.showStatus(res.data.status, 'Updating Project List : Failed!', 3000) &
                    console.error(res.data.error)
                }
                
            }, function errorCallback (error) {
                $scope.showStatus(false, 'Updating Project List : Failed!', 3000);
                console.error(error);
            });
    };


    /**
     * MODULES
     */
    $scope.modules = new Array;
    $scope.selectedModule = null;
    $scope.module = new Object;
    $scope.module.add = function (value) { $scope._modules.push(value) };
    $scope.module.getNames = function () {
        let data = $scope.module.get();
        let result = new Array;

        for(let i = 0; i < data.length; i++)
            result.push(data[i]._id);

        return result;
    };
    $scope.module.update = function () {
        if($scope.selectedProject !== null) {
            $rest.getAllModules({
                'projectName': $scope.selectedProject
            })
                .then(function successCallback (res) {
                    if(res.data.status) {
                        $scope.showStatus(res.data.status, 'Updating Module List : Successful!', 1000);
                        $scope.modules = res.data.body;
                    } 
                    else {
                        $scope.showStatus(res.data.status, 'Updating Module List : Failed!', 3000);
                        console.error(res.data.error);
                    }
                }, function errorCallback (error) {
                    $scope.showStatus(false, 'Updating Module List : Failed!', 3000);
                    console.error(error);
                });
        }
        else {
            $scope.showStatus(false, 'Updating Module List : Failed!', 3000);
            console.error({
                name: 'request not allowed',
                message: 'select a project before get all module'
            });
        }
    };
    $scope.module.getModuleViewTree = function () {
        let tree = new Array();

        if($scope.selectedModule !== null && 
            $scope.selectedModule.links !== undefined){
            tree = $scope.testcase.getByList($scope.selectedModule.links)
            tree.forEach(function (result, index) {
                if(tree[index].links !== undefined) {
                    tree[index].links = $scope.component.getByList(tree[index].links)
                }
            });
        }

        $scope.moduleViewTree = tree;
    }


    /**
     * TESTCASES
     */
    $scope.testcases = new Array();
    $scope.selectedTestCase = null;
    $scope.testcasesView = new Array();
    $scope.testcase = new Object;
    $scope.testcase.add = function (value) { $scope.testcases.push(value) };
    $scope.testcase.getNames = function () {
        let data = $scope.testcase.get();
        let result = new Array
        for(let i = 0; i < data.length; i++)
            result.push(data[i]._id);
        
        return result;
    };
    $scope.testcase.update = function () {
        if($scope.selectedProject !== null) {
            $rest.getAllTestCases({
                'projectName': $scope.selectedProject
            })
                .then(function successCallback (res) {

                    if(res.data.status) {
                        $scope.showStatus(res.data.status, 'Updating Test Case List : Successful!', 1000);
                        $scope.testcases = res.data.body;
                    }
                    else {
                        $scope.showStatus(res.data.status, 'Updating Test Case List : Failed!', 3000);
                        console.error(res.data.error);
                    }
                }, function errorCallback (error) {
                    $scope.showStatus(false, 'Updating Test Case List : Failed!', 3000);
                    console.error(error);
                });
        }
        else {
            $scope.showStatus(false, 'Updating Test Case List : Failed!', 3000);
            console.error({
                name: 'request not allowed',
                message: 'select a project before get all testcase'
            });
        }
    };
    $scope.testcase.getByList = function (value) {
        let result = new Array();

        for(let i = 0; i < value.length; i++)
            for(let j = 0; j < $scope.testcases.length; j++)
                if(value[i] === $scope.testcases[j]._id)
                    result.push($scope.testcases[j]);

        return result;
    }


    /**
     * COMPONENTS
     */
    $scope.components = new Array;
    $scope.selectedComponent = null;
    $scope.viewTestCases = new Array();
    $scope.component = new Object;
    $scope.component.add = function (value) { $scope.components.push(value) };
    $scope.component.getNames = function () {
        let data = $scope.component.get();
        let result = new Array
        for(let i = 0; i < data.length; i++)
            result.push(data[i]._id);
        
        return result;
    };
    $scope.component.update = function () {
        if($scope.selectedProject !== null) {
            $rest.getAllComponents({
                'projectName': $scope.selectedProject
            })
                .then(function successCallback (res) {
                    if(res.data.status) {
                        $scope.showStatus(res.data.status, 'Updating Component List : Successful!', 1000);
                        $scope.components = res.data.body;
                    }
                    else {
                        $scope.showStatus(res.data.status, 'Updating Component List : Failed!', 3000);
                        console.error(res.data.error);
                    }                        
                }, function errorCallback (error) {
                    $scope.showStatus(false, 'Updating Component List : Failed!', 3000);
                    console.error(error);
                });
        }
        else {
            $scope.showStatus(false, 'Updating Component List : Failed!', 3000);
            console.error({
                name: 'request not allowed',
                message: 'select a project before get all components'
            });
        }
    };
    $scope.component.getByList = function (value) {
        let result = new Array();

        for(let i = 0; i < value.length; i++)
            for(let j = 0; j < $scope.components.length; j++)
                if(value[i] === $scope.components[j]._id)
                    result.push($scope.components[j]);

        return result;
    }
    $scope.component.setEditorContent = function (value) {
        if (value.content !== null &&
            value.content !== undefined)
            $scope.editor.setValue(value.content);
        else
            $scope.editor.setValue('');
    }
    $scope.component.setSelected = function(component) {
        $scope.selectedComponent = component;
    };


    


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
        if ($scope.selectedProject !== undefined && 
            $scope.selectedProject !== null) {
            $scope.moduleSelectorIsDisabled = false;
            return 'Project : ' + $scope.selectedProject;
        } else {
            $scope.moduleSelectorIsDisabled = true;
            return 'Select a project';
        }
    };

    $scope.onProjectChange = function() {
        $scope.selectedModule = null;
        $scope.selectedTestCase = null;
        $scope.selectedComponent = null;

        $scope.module.update();
        $scope.testcase.update();
        $scope.component.update();
    };


    /********** TOOLBAR SELECT MODULE **********/
    $scope.getSelectedModule = function() {
        if ($scope.selectedModule !== null)
            return 'Module : ' + $scope.selectedModule._id;
        else
            return 'Select a module';
    };

    $scope.onModuleChange = function() {
        $scope.selectedTestCase = null;
        $scope.selectedComponent = null;
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
            console.log($scope.selectedComponent)

            if ($scope.selectedComponent !== undefined) {
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
                    });
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

    $scope.selectTestCase = function(testcase) {
        $scope.selectedTestCase = testcase;
    };


    $scope.openDialog = function($event) {
        $mdDialog.show({
            controller: DialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'dialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true
        });
    };


    function DialogCtrl($timeout, $q, $scope, $mdDialog) {
        var self = this;

        // list of `state` value/display objects
        self.states = loadAll();
        // self.states = $scope.project.getNames();
        // console.log(self.states);
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
            return query ? self1.states.filter(createFilterFor(query)) : self.states;
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
    };

    constructor();

});