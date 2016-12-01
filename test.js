/**
     * ITEM ARRAY CONTROLLERS
     */
    self.update = function (oldValArray, val) {
    	    let result = angular.copy(oldValArray);
            let index = result.findIndex(element => element._id === val._id);
            ~index ? result.splice(index, 1, val) : result.push(val)
    	    return result;
    }

	self.remove = function (oldValArray, val) {
        return oldValArray.filter(element => element._id !== val._id);
	}



	/**
     * SELECTED ITEM CONTROLLERS
     */
	self.updateSelected = function (selectedVal, val) {
		return (selectedVal !== null && selectedVal._id === val._id) ? val : selectedVal
	}

	self.removeSelected = function (selectedVal, val) {
		return selectedVal === val ? null : selectedVal
	}

	self.showStatus = function (status, message) {
		return {
			status: status, 
			message: message
		}
	};














	self.add = function (oldValArray, val) {
		oldValArray.push(val);
		return oldValArray;
	};

	self.remove = function (oldValArray, val) {
		return oldValArray.filter(element => element !== val);
	};

	self.rename = function (oldValArray, oldVal, newVal) {
		let index = oldValArray.indexOf(oldVal);

		~index && (oldValArray[index] = newVal)
		return oldValArray;
	};

	self.refresh = function () {
		return $restService.getAllProjects;
	}

	self.renameSelected = function (selectedVal, oldVal, newVal) {
		return selectedVal === oldVal ? newVal : oldVal
	};

	self.removeSelected = function (selectedVal, oldVal) {
		return selectedVal === oldVal ? null : oldVal
	};

	self.showStatus = function (status, message) {
		return {
			status: status, 
			message: message
		}
	};



















	app.directive( "contextMenu", function($compile, $interpolate){

    contextMenu = {};
    contextMenu.restrict = "AE";
    /*contextMenu.controller = function ($scope) {
        console.log($scope.onRightClick)
    }*/

    contextMenu.link = function( lScope, lElem, lAttr){
        lElem.on("contextmenu", function (e) {

            e.preventDefault();

            if($("#contextmenu-node"))
                $("#contextmenu-node").remove();

            lElem.append( $compile( lScope.content.properties.contextMenu[lAttr.contextmenuTemplate] )(lScope) );

            $("#contextmenu-node").css("left", e.clientX);
            $("#contextmenu-node").css("top", e.clientY - 55);
        });

        lElem.on("mouseleave", function(e){
            if($("#contextmenu-node"))
                $("#contextmenu-node").remove();
        });
    };

    return contextMenu;
});






































    /**
     * CONSTRUCTOR
     */
    let constructor = function () {
        $scope.content.uiControllers.project.getAll();

        $scope.content.properties.module.selectorIsDisabled = true;

        $scope.content.properties.sideNav.selectedViewType = 'module-browser';

        $complexScopeUpdaterService.constructor($scope.content.properties);

        $scope.content.properties.contextMenu.onTCRightClick =
            `   <div id='contextmenu-node'>
                    <div class='contextmenu-item' ng-click="content.uiControllers.dialog.openDialog($event, 'component', 'create', tc)">Create Component</div>
                    <div class='contextmenu-item' ng-click="content.uiControllers.dialog.openDialog($event, tc)">Create Component</div>
                    <div class='contextmenu-item' ng-click="content.uiControllers.dialog.openDialog($event, tc)">Create Component</div>
                </div>
            `;
     };


    /**
     * WATCHERS
     */
    $scope.$on('updated:ModuleViewJsonTree', function(event, data) {
        $scope.content.properties.viewTrees.moduleBrowserTree = data;
        $scope.$apply();
    });

    $scope.$on('updated:editorContent', function (event, data){
        $scope.content.uiControllers.editor.setEditorContent(data)
    });

    /**
     * PROPERTIES
     */
    $scope.content = new Object();
    $scope.content.properties = new Object();

    $scope.content.properties.applicationName = 'AutoMate';

    $scope.content.properties.project = new Object();
    $scope.content.properties.project.projects = new Array();
    $scope.content.properties.project.selected = null;

    $scope.content.properties.module = new Object();
    $scope.content.properties.module.modules = new Array();
    $scope.content.properties.module.selected = null;
    $scope.content.properties.module.selectorIsDisabled = new Boolean();

    $scope.content.properties.testcase = new Object();
    $scope.content.properties.testcase.testcases = new Object();
    $scope.content.properties.testcase.selected = null;

    $scope.content.properties.component = new Object();
    $scope.content.properties.component.components = new Array();
    $scope.content.properties.component.selected = null;

    $scope.content.properties.statusBar = new Object();
    $scope.content.properties.statusBar.color = null;
    $scope.content.properties.statusBar.status = null;

    $scope.content.properties.sideNav = new Object();
    $scope.content.properties.sideNav.selectedViewType = null;

    $scope.content.properties.viewTrees = new Object();
    $scope.content.properties.viewTrees.moduleBrowserTree = new Array();
    $scope.content.properties.viewTrees.x = new Array();

    $scope.content.properties.editor = new Object();
    $scope.content.properties.editor.editorContent = '';

    $scope.content.properties.contextMenu = new Object();


    /**
     * UI CONTROLLER PROPERTIES
     */
    $scope.content.uiControllers = new Object();


    /**
     * PROJECT CONTROLLERS
     */
    $scope.content.uiControllers.project = new Object();



    $scope.content.uiControllers.project.onChange = function() {

        /* GETTING PROJECT CONTENT FORM THE DB */
        $scope.content.uiControllers.module.getAll({
            projectName: $scope.content.properties.project.selected
        });

        $scope.content.uiControllers.testcase.getAll({
            projectName: $scope.content.properties.project.selected
        });

        $scope.content.uiControllers.component.getAll({
            projectName: $scope.content.properties.project.selected
        });

        /* CHANGE UI PROPERTIES */
        $scope.content.properties.module.selectorIsDisabled = false;
        $scope.content.properties.module.selected = null;
        $scope.content.properties.viewTrees.moduleBrowserTree = new Array();

        /* ACTIVATE SOCKET IO */
        $complexScopeUpdaterService.socketObj.deleteProjectSocket();
        $complexScopeUpdaterService.socketObj.createProjectSocket($scope.content.properties.project.selected);
        $complexScopeUpdaterService.socketObj.activateProjectSocket();

    };

    $scope.content.uiControllers.project.getAutocompleteMap = function () {
        return $scope.content.uiControllers.project.projects.map(function (element) {
            return {
                value: element.toLocaleLowerCase(),
                display: element
            }
        });
    };

    $scope.content.uiControllers.project.getAll = function () {
        $restService.getAllProjects()
            .then(
            function successCallback (res) {
                res ?
                    $scope.content.properties.project.projects = res.data.val :
                    console.log('********** Getting All Projects - Error **********') &
                    console.error(res.data.error)
            },
            function errorCallback (error) {
                console.log('********** Getting All Projects - Error **********');
                console.error(res.data.error);
            });
    };


    /**
     * MODULE CONTROLLERS
     */
    $scope.content.uiControllers.module = new Object();

    $scope.content.uiControllers.module.getSelectedModule = function() {
            if ($scope.content.properties.module.selected !== null)
                return 'Module : ' + $scope.content.properties.module.selected._id;
            else
                return 'Select a module';
        };

    $scope.content.uiControllers.module.onChange = function() {
        $scope.content.properties.viewTrees.moduleBrowserTree =
            $moduleBrowserService.getModuleViewJsonTree(
                $scope.content.properties.testcase.testcases,
                $scope.content.properties.component.components,
                $scope.content.properties.module.selected
            );
    };

    $scope.content.uiControllers.module.getAutocompleteMap = function () {
        return $scope.content.uiControllers.module.modules.map(function (element) {
            return {
                value: element._id.toLocaleLowerCase(),
                display: element._id
            }
        });
    };

    $scope.content.uiControllers.module.getAll = function (selectedProject) {
        $restService.getAllModules(selectedProject)
            .then(
                function successCallback (res) {
                    res.data.status ?
                        $scope.content.properties.module.modules = res.data.val :
                        console.log('********** Getting All Modules - Error **********') &
                        console.error(res.data.error)
                },
                function errorCallback (error) {
                    console.log('********** Getting All Modules - Error **********');
                    console.error(error);
                }
            )
    };


    /**
     * TESTCASE CONTROLLERS
     */
    $scope.content.uiControllers.testcase = new Object();

    $scope.content.uiControllers.testcase.setSelected = function (testcase) {
                $scope.content.properties.testcase.selected = testcase;
                //
            };

    $scope.content.uiControllers.testcase.getAutocompleteMap = function () {
        return $scope.content.uiControllers.testcase.testcases.map(function (element) {
            return {
                value: element._id.toLocaleLowerCase(),
                display: element._id
            }
        });
    };

    $scope.content.uiControllers.testcase.getAll = function (selectedProject) {
            $restService.getAllTestCases(selectedProject)
                .then(
                    function successCallback(res) {
                        res.data.status ?
                            $scope.content.properties.testcase.testcases = res.data.val :
                            console.error('********** Getting All Test Case - Error **********') &
                            console.error(res.data.error)
                    },
                    function errorCallback(error) {
                        console.error('********** Getting All Test Case - Error **********');
                        console.error(error);
                    });
        };




    /**
     * COMPONENT CONTROLLERS
     */
    $scope.content.uiControllers.component = new Object();

    $scope.content.uiControllers.component.setSelected = function (component) {
            $scope.content.properties.component.selected = component;
            //
        };

    $scope.content.uiControllers.component.getAutocompleteMap = function () {
        return $scope.content.uiControllers.component.components.map(function (element) {
            return {
                value: element._id.toLocaleLowerCase(),
                display: element
            }
        });
    };

    $scope.content.uiControllers.component.create = function (name, selectedParentNode) {
                let selectedParentOriginalNode =
                    $scope.content.properties.testcase.testcases.filter(element => element._id === selectedParentNode._id)[0];

                $restService.createComponent({
                    projectName: $scope.content.properties.project.selected,
                    selectedParentNode: selectedParentOriginalNode,
                    val: {
                        _id: name,
                        type: 'component'
                    }
                })
                    .then(
                    function successCallback(res) {

                    },
                    function errorCallback(error) {

                    });
            };

    $scope.content.uiControllers.component.getAll = function (selectedProject) {
            $restService.getAllComponents(selectedProject)
                .then(
                    function successCallback(res) {
                        res.data.status ?
                            $scope.content.properties.component.components = res.data.val :
                            console.error('********** Getting All Test Case - Error **********') &
                            console.error(res.data.error)
                    },
                    function errorCallback(error) {
                        console.error('********** Getting All Test Case - Error **********');
                        console.error(error);
                    });
        };




    /**
     * SIDE NAV CONTROLLERS
     */
    $scope.content.uiControllers.sideNav = new Object();

    let buildToggle = function (componentID) {
            return function() {
                $mdSidenav(componentID).toggle();
            };
        };

    $scope.content.uiControllers.sideNav.toggleNav = buildToggle('side-nav');


    /**
     * EDITOR CONTROLLERS
     */
    $scope.content.uiControllers.editor = new Object();

    let textArea = document.getElementById('textArea');

    $scope.content.uiControllers.editor.codeMirrorObj = CodeMirror.fromTextArea(textArea, {
        lineNumbers: true
    });

    $scope.content.uiControllers.editor.setEditorContent = function (content) {
        content ?
            $scope.content.uiControllers.editor.codeMirrorObj.setValue(content):
            $scope.content.uiControllers.editor.codeMirrorObj.setValue('')
    };

    $scope.content.uiControllers.editor.codeMirrorObj.setOption("extraKeys", {
        'Ctrl-S': function(cm) {

            if ($scope.content.properties.component.selected !== null) {
                let component = angular.copy($scope.content.properties.component.selected);

                component.content = cm.doc.getValue();

                $restService.setComponent({
                        'projectName': $scope.content.properties.project.selected,
                        'val': component
                })
                    .then(function successCallback(res) {
                        res.data.status ?
                            console.log('Saving Component - Successful!') &
                            console.log(res.data.val) :
                            console.log('Saving Component - Failed!') &
                            console.log(res.data.error)
                    }, function errorCallback(error) {
                        console.log('Saving Component - Failed!')
                        console.error(error);
                    });
            }
        }
    });


    /**
     * STATUS BAR CONTROLLERS
     */
    $scope.content.uiControllers.statusBar = new Object();

    $scope.content.uiControllers.statusBar.showStatus = function(status, message, timeout) {
            status ? $scope.statusBarColor = 'success-status' :
                $scope.statusBarColor = 'error-status';

            $scope.content.properties.statusBar.status = message;

            $timeout(function() {
                $scope.content.properties.statusBar.statusBarColor = 'default-status';
                $scope.content.properties.statusBar.status = '';
            }, timeout);
        };


    /**
     * OPTION MENU CONTROLLERS
     */
    $scope.content.uiControllers.optionMenu = new Object();

    $scope.content.uiControllers.optionMenu.openOptionMenu = function($mdOpenMenu, ev) {
       $mdOpenMenu(ev);
       //
    };


    /**
     * DIALOG CONTROLLERS
     */
    $scope.content.uiControllers.dialog = new Object();
    $scope.content.uiControllers.dialog.openDialog = function ($event, itemType, action, selectedTestcase) {
        let self = this;

        $mdDialog.show({
            controller: DialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'dialog-template',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            locals: {
                lscope: $scope,
                itemType: itemType,
                action: action,
                parentNode: selectedTestcase
            }
        });

        let dialogControllers = new Object();

        dialogControllers.createProject = function (name, callback) {
            $restService.createProject({
                projectName: name
            })
                .then(
                    function successCallback(res) {
                        callback(res.data);
                    },
                    function errorCallback(error) {
                        callback({
                            status: false,
                            val: null,
                            error: error
                        });
                    });

        };
        dialogControllers.createModule = function (selectedProject, name, callback) {
            $restService.createModule({
                projectName: selectedProject,
                val: {
                    _id: name,
                    type: 'module'
                }
            })
                .then(
                    function successCallback(res) {
                        callback(res.data);
                    },
                    function errorCallback(error) {
                        callback({
                            status: false,
                            val: null,
                            error: error
                        });
                    });

        };
        dialogControllers.createTestcase = function (selectedProject, name, parentNode, callback) {
            console.log('********'+parentNode)
            $restService.createTestcase({
                projectName: selectedProject,
                parentNode: parentNode,
                val: {
                    _id: name,
                    type: 'testcase'
                }
            })
                .then(
                    function successCallback(res) {
                        callback(res.data);
                    },
                    function errorCallback(error) {
                        callback({
                            status: false,
                            val: null,
                            error: error
                        });
                    });

        };
        dialogControllers.createComponent = function (selectedProject, name, parentNode, callback) {
            $restService.createComponent({
                projectName: selectedProject,
                parentNode: parentNode,
                val: {
                    _id: name,
                    type: 'component'
                }
            })
                .then(
                    function successCallback(res) {
                        callback(res.data);
                    },
                    function errorCallback(error) {
                        callback({
                            status: false,
                            val: null,
                            error: error
                        });
                    });

        };


        function DialogCtrl($mdDialog, $scope, $restService, lscope, itemType, action, parentNode) {
            let self = this;

            $scope.itemType = itemType;
            $scope.action = action;

            self.project = lscope.content.properties.project.selected;

            self.ok = function () {
                switch(itemType) {
                    case 'project': {
                        action === 'create' &&
                            dialogControllers.createProject(self.searchText, $mdDialog.hide);
                    } break;


                    case 'module': {
                        action === 'create' &&
                            dialogControllers.createModule(self.project, self.searchText, $mdDialog.hide);
                    } break;


                    case 'testcase': {
                        action === 'create' &&
                            (self.parentNode = lscope.content.properties.module.selected) &
                            dialogControllers.createTestcase(self.project, self.searchText, self.parentNode, $mdDialog.hide)
                    } break;


                    case 'component': {
                        action === 'create' &&
                            (self.parentNode = lscope.content.properties.testcase.testcases.filter(element => element._id === parentNode._id)[0]) &
                            dialogControllers.createComponent(self.project, self.searchText, self.parentNode, $mdDialog.hide)
                    } break;
                }
            }

            self.cancel = function($event) {
                $mdDialog.cancel();
            };


        }
    };

    constructor();