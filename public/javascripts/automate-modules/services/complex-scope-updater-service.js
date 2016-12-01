app.service('$complexScopeUpdaterService', complexScopeUpdaterService);

function complexScopeUpdaterService ($rootScope, $projectService, $moduleService, $testcaseService, $componentService, $moduleBrowserService, $editorService) {

    /**
     * SELF
     */
    let self = this;
    self.properties = new Object();


    /**
     * CONSTRUCTOR
     */
    self.constructor = function (properties) {
        self.properties = properties;
        self.socketObj.rootSocket = io('http://cmdsnmuhandiram:3001/');
        self.socketObj.activateAppSocket();
    };


    /**
     * SCOPE PROPERTIES
     */
    //self.x = new Object();


    /**
     * SOCKET IO PROPERTIES
     */
    self.socketObj = new Object();
    self.socketObj.rootSocket = new Object();
    self.socketObj.project = new Object();


    /**
     * SOCKET IO CONTROLLERS
     */

    /* ROOT SOCKET */
    self.socketObj.activateAppSocket = function () {
        self.socketObj.rootSocket.on('connect', function () {
            console.log('Client : Starting app socket');
        });
        self.socketObj.rootSocket.on('updates', onAppUpdate);
    }

    /* PROJECT SOCKET */
    self.socketObj.createProjectSocket = function (projectName) {
            let urlString = `http://cmdsnmuhandiram:3001/${projectName}`;
            self.socketObj.project = io(urlString);
    }

    self.socketObj.deleteProjectSocket = function () {
        self.socketObj.project &&
            (delete self.socketObj.project)
    }

    self.socketObj.activateProjectSocket = function () {
        self.socketObj.project.on('connect', function() {
            console.log('Client : Starting project socket');
        });

        self.socketObj.project.on('ServerMessage', function (data) {
            console.log(data);
        });

        self.socketObj.project.on('updates', onProjectUpdate);
    }

    self.socketObj.deactivateProjectSocket = function () {
        self.socketObj.project.disconnect();
    }


    /**
     * PROJECT COMPLEX UPDATERS
     */
    let onAppUpdate = function (res) {
    	switch(data.change) {

    		case 'create': {
    			self.properties.project.projects = 
    				$projectService.add(data.val);
    		} break;


    		case 'rename': {
    			self.properties.project.projects = 
    				$projectService.rename(self.properties.project.projects, data.val.oldVal, data.val.newVal);

    			self.properties.project.selected = 
    				$projectService.renameSelected(self.properties.project.selected, data.val.oldVal, data.val.newVal);
    		} break;


    		case 'delete': {
    			self.properties.project.projects = 
    				$projectService.remove(self.properties.project.projects, data.val);

    			self.properties.project.selected = 
    				$projectService.removeSelected(self.properties.project.selected, data.val);
    		}
    	}
    };

    let onProjectUpdate = function (data) {
        console.log(data);


        switch(data.val.type) {
            case 'module': onModuleChange(data); break;
            case 'testcase': onTCChange(data); break;
            case 'component': onComponentChange(data); break;
        }
    };

    let onModuleChange = function (data) {
        switch(data.change) {
            case 'createOrUpdate': {
                self.properties.module.modules =
                    $moduleService.update(self.properties.module.modules, data.val);

                self.properties.module.selected =
                    $moduleService.updateSelected(self.properties.module.selected, data.val);

                /*self.properties.module.modules.findIndex(element => element._id === data.val._id) > -1 &&
                    (self.properties.viewTrees.moduleBrowserTree =
                        $moduleBrowserService.getModuleViewJsonTree(self.properties.testcase.testcases,
                                                                    self.properties.component.components,
                                                                    self.properties.module.selected))*/

                let result;
                ~self.properties.module.modules.findIndex(element => element._id === data.val._id) &&
                    (result =
                        $moduleBrowserService.getModuleViewJsonTree(self.properties.testcase.testcases,
                                                                    self.properties.component.components,
                                                                    self.properties.module.selected)) &
                    $rootScope.$broadcast('updated:ModuleViewJsonTree', result)
            } break;

            case 'delete': {
                self.properties.module.modules =
                    $moduleService.remove(self.properties.module.modules, data.val);

                self.properties.module.updateSelected =
                    $moduleService.remove(self.properties.module.selected, data.val);
            } break;
        }
    };

    let onTCChange = function (data) {
        switch(data.change) {
            case 'createOrUpdate': {
                self.properties.testcase.testcases =
                    $testcaseService.update(self.properties.testcase.testcases, data.val);

                self.properties.testcase.selected =
                    $testcaseService.updateSelected(self.properties.testcase.selected, data.val);

                let result;
                result =
                    $moduleBrowserService.getModuleViewJsonTree(self.properties.testcase.testcases,
                                                                self.properties.component.components,
                                                                self.properties.module.selected);
                $rootScope.$broadcast('updated:ModuleViewJsonTree', result)
            } break;

            case 'delete': {
                self.properties.testcase.testcases =
                    $testcaseService.update(self.properties.testcase.testcases, data.val);

                self.properties.testcase.selected =
                    $testcaseService.updateSelected(self.properties.testcase.selected, data.val);

                self.properties.viewTrees.moduleBrowserTree =
                    $moduleBrowserService.getModuleViewJsonTree(self.properties.testcase.testcases,
                                                                self.properties.component.components,
                                                                self.properties.module.selected);
            } break;
        }
    };

    let onComponentChange = function (data) {
        switch(data.change) {
            case 'createOrUpdate': {
                self.properties.component.components =
                    $componentService.update(self.properties.component.components, data.val);

                self.properties.component.selected =
                    $componentService.updateSelected(self.properties.component.selected, data.val);

                let ModuleViewJsonTree;
                ModuleViewJsonTree =
                    $moduleBrowserService.getModuleViewJsonTree(self.properties.testcase.testcases,
                                                                self.properties.component.components,
                                                                self.properties.module.selected);
                $rootScope.$broadcast('updated:ModuleViewJsonTree', ModuleViewJsonTree);

                let editorContent;
                editorContent =
                    $editorService.getEditorContent(self.properties.component.selected, data.val);
                $rootScope.$broadcast('updated:editorContent', editorContent);
            } break;

            case 'delete': {
                self.properties.component.components =
                    $componentService.remove(self.properties.component.components, data.val);

                self.properties.component.selected =
                    $componentService.updateSelected(self.properties.component.selected, data.val);

                let ModuleViewJsonTree;
                ModuleViewJsonTree =
                    $moduleBrowserService.getModuleViewJsonTree(self.properties.testcase.testcases,
                                                                self.properties.component.components,
                                                                self.properties.module.selected);
               $rootScope.$broadcast('updated:ModuleViewJsonTree', ModuleViewJsonTree);


                let editorContent;
                    editorContent =
                        $editorService.deleteEditorContent(self.properties.editor.editorContent, val);
                $rootScope.$broadcast('updated:editorContent', editorContent);
            } break;
        }
    };
};