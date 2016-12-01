$scope.openDialog = function($event, itemType) {
        $mdDialog.show({
            controller: DialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'dialog-template',
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
            },
            preserveScope: true
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
                    else if(itemType === 'Testcase') {
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