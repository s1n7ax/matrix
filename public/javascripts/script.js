/* global let */

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
    $scope.project.add = function (value) { $scope.projects.push(value); };
    $scope.project.getAutocompleteMap = function () {
        return $scope.projects.map(function (data) {
            return {
                value: data,
                display: data
            };
        });
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
                    console.error(res.data.error);
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
    $scope.module.add = function (value) { $scope._modules.push(value); };
    $scope.module.getAutocompleteMap = function () {
        return $scope.modules.map(function (data) {
            return {
                value: data._id.toLowerCase(),
                display: data._id
            };
        });
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
            tree = $scope.testcase.getByList($scope.selectedModule.links);
            tree.forEach(function (result, index) {
                if(tree[index].links !== undefined) {
                    tree[index].links = $scope.component.getByList(tree[index].links);
                }
            });
        }

        $scope.moduleViewTree = tree;
    };


    /**
     * TESTCASES
     */
    $scope.testcases = new Array();
    $scope.selectedTestCase = null;
    $scope.testcasesView = new Array();
    $scope.testcase = new Object;
    $scope.testcase.add = function (value) { $scope.testcases.push(value); };
    $scope.testcase.getAutocompleteMap = function () {
        return $scope.testcases.map(function (data) {
            return {
                value: data._id.toLowerCase(),
                display: data._id
            };
        });
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
    };


    /**
     * COMPONENTS
     */
    $scope.components = new Array;
    $scope.selectedComponent = null;
    $scope.viewTestCases = new Array();
    $scope.component = new Object;
    $scope.component.add = function (value) { $scope.components.push(value); };
    $scope.component.getAutocompleteMap = function () {
        return $scope.components.map(function (data) {
            return {
                value: data._id.toLowerCase(),
                display: data._id
            };
        });           
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
    };
    $scope.component.setEditorContent = function (value) {
        if (value.content !== null &&
            value.content !== undefined)
            $scope.editor.setValue(value.content);
        else
            $scope.editor.setValue('');
    };
    $scope.component.setSelected = function(component) {
        $scope.selectedComponent = component;
    };


    


    /********** OPTION MENU **********/
    $scope.openOptionMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
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

    $scope.onTCRightClick = 
    `<div>
        <ul id='contextmenu-node'>
            <li class='contextmenu-item' ng-click='clickedItem1()'> Item 1 </li>
            <li class='contextmenu-item' ng-click='clickedItem2()'> Item 2 </li>
        </ul>
    </div>`

    $scope.clickedItem1 = function(){
        console.log("Clicked item 1.");
    };
    $scope.clickedItem2 = function(){
        console.log("Clicked item 2.");
    };


    /********** SIDE NAVIGATOR **********/
    $scope.toggleNav = buildToggle('side-nav');

    function buildToggle(componentID) {
        return function() {
            $mdSidenav(componentID).toggle();
        };
    }


    /********** SIDE NAVIGATOR BAR **********/
    $scope.selectedViewType = 'module-view';


    /********** EDITOR **********/
    var textArea = document.getElementById('textArea');

    $scope.editor = CodeMirror.fromTextArea(textArea, {
        lineNumbers: true,
    });

    $scope.editor.setOption("extraKeys", {
        'Ctrl-L': function(cm) {
            console.log('this is a test');

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


    $scope.openDialog = function($event, itemType) {
        $mdDialog.show({
            controller: DialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'dialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            locals: {
                'items' :{
                    projects: $scope.project.getAutocompleteMap(),
                    modules: $scope.module.getAutocompleteMap(),
                    testcases: $scope.testcase.getAutocompleteMap(),
                    components: $scope.component.getAutocompleteMap()
                    
                },
                'itemType': itemType,
                'selectedItems': {
                    project: $scope.selectedProject,
                    module: $scope.selectedModule,
                    testcase: $scope.selectedTestCase,
                    component: $scope.selectedComponent 
                }
            }
        });


        function DialogCtrl($timeout, $q, $scope, $mdDialog, items, itemType, selectedItems) {
            var self = this;
            $scope.itemType = itemType;

            switch(itemType) {
                case 'Project': self.states = items.projects; break;
                case 'Module': self.states = items.modules; break;
                case 'Testcase': self.states = items.testcases; break;
                case 'Component': self.states = items.components; break;
            }

            self.querySearch = querySearch;

            self.cancel = function($event) {
                $mdDialog.cancel();
            };
            self.ok = function($event) {
                if(self.searchText !== null &&
                    self.searchText !== undefined){
                    
                    if(itemType === 'Project') {
                        $rest.createProject({
                            'projectName': self.searchText
                        })
                        .then(function successCallback(res) {
                            let status, 
                                message = `Creating ${itemType} : `;

                            if(res.data.status)
                                (status = true) & 
                                (message = message+ 'Successful!')
                            else
                                (status = false) & 
                                (message = message+ 'Failed!') &
                                console.error(res.data.error)

                            showStatus(status, message);
                        });
                    }
                    else if(itemType === 'Module') {
                        if(selectedItems.project !== null) {
                            $rest.createModule({
                                'projectName': selectedItems.project,
                                'values': {
                                    _id: self.searchText,
                                    type: 'module'
                                }
                            })
                            .then(function successCallback(res) {
                                let status, 
                                    message = `Creating ${itemType} : `;

                                if(res.data.status)
                                    (status = true) & 
                                    (message = message+ 'Successful!')
                                else
                                    (status = false) & 
                                    (message = message+ 'Failed!') &
                                    console.error(res.data.error)
                            });
                        }
                    }
                    else if(itemType === 'TestCase') {
                        if(selectedItems.module !== null) {
                            $rest.createTestCase({
                                'projectName': selectedItems.project,
                                'values': {
                                    _id: self.searchText,
                                    type: 'testcase'
                                },
                                'module': selectedItems.module
                            })
                            .then(function successCallback(res) {
                                let status, 
                                    message = `Creating ${itemType} : `;

                                if(res.data.status)
                                    (status = true) & 
                                    (message = message+ 'Successful!')
                                else
                                    (status = false) & 
                                    (message = message+ 'Failed!') &
                                    console.error(res.data.error)
                            });
                        }
                    }
                }
                $mdDialog.hide();
            };

            function querySearch(query) {
                return query ? self.states.filter(createFilterFor(query)) : self.states;
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);

                return function filterFn(state) {
                    return (state.value.indexOf(lowercaseQuery) === 0);
                };

            }
        }
    };

    constructor();

})
.directive( "contextMenu", function($compile){
    contextMenu = {};
    contextMenu.restrict = "AE";
    contextMenu.link = function( lScope, lElem, lAttr ){
        lElem.on("contextmenu", function (e) {
            e.preventDefault(); // default context menu is disabled
            //  The customized context menu is defined in the main controller. To function the ng-click functions the, contextmenu HTML should be compiled.
            lElem.append( $compile( lScope[ lAttr.contextMenu ])(lScope) );
            // The location of the context menu is defined on the click position and the click position is catched by the right click event.
            $("#contextmenu-node").css("left", e.clientX);
            $("#contextmenu-node").css("top", e.clientY);            
        });
        lElem.on("mouseleave", function(e){
            console.log("Leaved the div");
            // on mouse leave, the context menu is removed.
            if($("#contextmenu-node") )
                $("#contextmenu-node").remove();
        });
    };
    return contextMenu;
});
