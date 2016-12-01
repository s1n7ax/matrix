reporter.controller('reporter_ctrl', reporterCtrl);
reporter.service('$restService',restService);

function reporterCtrl ($scope, $restService) {
    /**
     * Common Properties
     */
    $scope.applicationName = 'Sanitize Reporter';

    $scope.maxStepCount;
    $scope.minStepCount;

    $scope.maxUsage;
    $scope.minUsage;


    /**
     * Common
     */
    let errorLog = function (message, error) {
        console.log('\n***************************');
        console.log(message);
        console.error(error);
        console.log('***************************');
    };

    let successLog = function (message, data) {
        console.log('\n***************************');
        console.log(message);
        console.log(data);
        console.log('***************************');
    };

    /**
     * Project
     */
    $scope.showTable = false;
    $scope.project = {};
    $scope.project.list;
    $scope.project.selected;

    $scope.project.getSelectMenuString = function () {
        if($scope.project.selected)
            return 'Project : '+$scope.project.selected;
        else
            return 'Select A Project';
    };

    $scope.project.dbRetrieve = function () {
        $restService.getAllProjects()
        .then(
        function successCallback(res) {
            if(res.data.status) {
                successLog('Getting All Project - Successful!', res.data);
                $scope.project.list = res.data.val;
            }
            else
                errorLog('Getting All Project - Failed!', res.data.error);
        },
        function errorCallback(error) {
            errorLog('Getting All Project - Failed!', error);
        });
    };

    $scope.project.onChange = function () {
        if($scope.project.selected) {
            $restService.getAllComponents({
                projectName: $scope.project.selected
            })

            .then(function successCallback(res) {
                if(res.data.status){
                    successLog('Getting All Components - Successful!', res.data);
                    $scope.component.list = res.data.val;
                }
                else {
                    errorLog('Getting All Components - Failed!', res.data.error);
                }
            },
            function errorCallback (error) {
                errorLog('Getting All Components - Failed!', res.data.error);
            })

            .then(function () {
                return $restService.getAllTestcases({
                    projectName: $scope.project.selected
                });
            })

            .then(function (res) {
                if(res.data.status){
                    successLog('Getting All Testcases - Successful!', res.data);
                    $scope.testcase.list = res.data.val;
                }
                else {
                    errorLog('Getting All Testcases - Failed!', res.data.error);
                }
            })

            .then(function () {
                $scope.component.setCommonMap();
                $scope.testcase.setCommonMap();
                $scope.component.setStepCountMaxAndMin();
                $scope.component.setUsageMaxAndMin();
                $scope.showTable = true;
                $scope.matrix.setTCMatrix();
            });
        }
    };

    /**
     * Component
     */
    $scope.component = {};
    $scope.component.list;
    $scope.component.commonMap;

    $scope.component.setCommonMap = function () {
        let obj = {};

        $scope.component.list.forEach((element) => {
            obj[element._id] = {};
            obj[element._id]['status'] = element.status;
            obj[element._id]['stepCount'] = $scope.component.getStepCount(element.content);
            obj[element._id]['owner'] = element.owner;
            obj[element._id]['usage']  = $scope.component.getUsage(element._id);
        });

        $scope.component.commonMap = obj;
    };

    $scope.component.getStepCount = function (content) {
        if(content !== undefined) {
            filteredArr = content.split('\n').filter(e => e.match(/\S/));
            return filteredArr.length;
        }
        else {
            return 0;
        }
    };

    $scope.component.getUsage = function (id) {
        let count = 0;

        $scope.testcase.list.forEach((element1) => {
            let calledCMP = $scope.testcase.getCalledComponents(element1.content).components;
            calledCMP.forEach((element2) => {
                if(element2 === id)
                    count++;
            });
        });

        return count;
    };

    $scope.component.setStepCountMaxAndMin = function () {
        let keys = Object.keys($scope.component.commonMap);

        $scope.maxStepCount = $scope.component.commonMap[keys[0]].stepCount;
        $scope.minStepCount = $scope.maxStepCount;

        for(let i = 0; i < keys.length; i++) {
            let stepC = $scope.component.commonMap[keys[i]].stepCount;

            if(stepC > $scope.maxStepCount)
                $scope.maxStepCount = stepC;
            if(stepC < $scope.minStepCount)
                $scope.minStepCount = stepC;

        }
    };

    $scope.component.setUsageMaxAndMin = function () {
        let keys = Object.keys($scope.component.commonMap);

        $scope.maxUsage = $scope.component.commonMap[keys[0]].usage;
        $scope.minUsage = $scope.maxUsage;

        for(let i = 0; i < keys.length; i++) {
            let usageC = $scope.component.commonMap[keys[i]].usage;

            if(usageC > $scope.maxUsage)
                $scope.maxUsage = usageC;
            if(usageC < $scope.minUsage)
                $scope.minUsage = usageC;
        }
    };


    /**
     * Testcases
     */
    $scope.testcase = {};
    $scope.testcase.list;
    $scope.testcase.commonMap;

    $scope.testcase.setCommonMap = function () {
        let obj = {};

        $scope.testcase.list.forEach((element) => {
            obj[element._id] = {};
            obj[element._id]['owner'] = element.owner;
            obj[element._id]['calledComponents'] = $scope.testcase.getCalledComponents(element.content).components;
            obj[element._id]['calledStatements'] = $scope.testcase.getCalledComponents(element.content).statements;
            obj[element._id]['calledComponentCount'] =  obj[element._id]['calledComponents'].length;
            obj[element._id]['status'] =
                $scope.testcase.getStatus($scope.project.selected, element._id, element.status, obj[element._id]['calledComponents']);
            obj[element._id]['stepCount'] = $scope.testcase.getStepCount(obj[element._id]['calledComponents'], obj[element._id]['calledStatements']);
            obj[element._id]['complexity'] = $scope.testcase.getComplexity(obj[element._id]['stepCount']);
       });

       $scope.testcase.commonMap = obj;
    };

    $scope.testcase.getCalledComponents = function (content) {
        if(content) {
            let contentArr = content.split('\n').filter(element => element.match(/\S/));

            let components = [];
            let statements = [];
            for(let i = 0; i < contentArr.length; i++) {
                let val = contentArr[i].match(/\bbc\S+|\bBC\S+/);

                if(val){
                    components.push(val[0]);
                }
                else {
                    statements.push(contentArr[i]);
                }
            }

            return {
                components: components,
                statements: statements
            };

            /*return contentArr.map(function (element) {
                let val = element.match(/\bbc\S+/);
                return val[0];
            });*/
        }
        else
            return {
                components: [],
                statements: []
            }
    };

    $scope.testcase.getStatus = function (project, id, actualStatus, calledComponents) {
        if(actualStatus !== 'Ready to automate' && calledComponents) {
            let status = false;

            calledComponents.forEach((element) => {
                if($scope.component.commonMap[element].status === 'Completed')
                    status = true;
                else {
                    status = false;
                    return 0;
                }

            });

            if(status) {
                status = false;
                $restService.partialUpdate({
                    projectName: project,
                    _id: id,
                    val: {
                        status: 'Completed'
                    }
                })
                .then(function (res) {
                    console.log(id);
                    if(res.data.status) {
                        successLog('Updating '+id+' status to "Complete" - Successful!', res.data);
                        $scope.project.onChange();
                    }
                    else {
                        errorLog('Updating '+id+' status to "Complete" - Failed!', res.data.error);
                    }
                },
                function (error) {
                    errorLog('Updating '+id+' status to "Complete" - Failed!', error);
                })
            }
        }
        return actualStatus;
    };

    $scope.testcase.getStepCount = function (calledComponents, calledStatements) {
        let stepCount = 0;

        calledComponents.forEach((element) => {
            stepCount += $scope.component.commonMap[element]['stepCount'];
        });

        return stepCount + calledStatements.length;
    };

    $scope.testcase.getComplexity = function (stepCount) {
        if(stepCount > 80)
            return 'H+';
        else if(stepCount > 40)
            return 'H';
        else if(stepCount > 20)
            return 'M';
        else
            return 'L';
    };


    /**
     * Matrix
     */
    $scope.matrix = {};
    $scope.matrix.tcMatrix;
    $scope.matrix.commonEmptySpace = new Array(5);

    $scope.matrix.getNameList = function () {
        if($scope.project.selected && $scope.showTable) {
            let list1 = $scope.matrix.commonEmptySpace.concat('BC Name');

            let list2 = $scope.component.list.map((element) => {
                return element._id;
            });

            return list1.concat(list2);
        }

    };

    $scope.matrix.getStatus = function () {
        if($scope.project.selected && $scope.showTable){
            let list1 = $scope.matrix.commonEmptySpace.concat('BC Status');

            let list2 = $scope.component.list.map((element) => {
                return $scope.component.commonMap[element._id].status;
            });

            return list1.concat(list2);
        }

    };

    $scope.matrix.getStepCount = function () {
        if($scope.project.selected && $scope.showTable) {
            let list1 = $scope.matrix.commonEmptySpace.concat('BC Step Count');

            let list2 = $scope.component.list.map((element) => {
                return $scope.component.commonMap[element._id].stepCount;
            });

            return list1.concat(list2);
        }
    };

    $scope.matrix.getOwner = function () {
        if($scope.project.selected && $scope.showTable) {
            let list1 = $scope.matrix.commonEmptySpace.concat('BC Owner');

            let list2 = $scope.component.list.map((element) => {
                return $scope.component.commonMap[element._id].owner;
            });

            return list1.concat(list2);
        }
    };

    $scope.matrix.getUsage = function () {
        if($scope.project.selected && $scope.showTable) {
            let list1 = $scope.matrix.commonEmptySpace.concat('BC Usage');

            let list2 = $scope.component.list.map((element) => {
                return $scope.component.commonMap[element._id].usage;
            });

            return list1.concat(list2);
        }
    };

    $scope.matrix.getTCHeader = function () {
        if($scope.project.selected && $scope.showTable) {
            let basic = ['TC Name', '	TC Owner', 'TC Status', 'TC Step Count', 'TC Complexity', 'No of BC Count'];

            $scope.component.list.forEach((element) => {
                basic.push(element._id);
            });

            return basic;
        }
    }

    $scope.matrix.setTCMatrix = function () {
        if($scope.project.selected && $scope.showTable) {
            let obj = $scope.testcase.list.map((element) => {
                return $scope.matrix.getTCRow(element._id);
            });

            console.log(obj);
            $scope.matrix.tcMatrix = obj;
        }
    };

    $scope.matrix.getTCRow = function (id) {
        let basic = [
            id,
            $scope.testcase.commonMap[id].owner,
            $scope.testcase.commonMap[id].status,
            $scope.testcase.commonMap[id].stepCount,
            $scope.testcase.commonMap[id].complexity,
            $scope.testcase.commonMap[id].calledComponentCount,
        ];

        let bcUsedCountList = $scope.component.list.forEach((element1) => {
            let count = 0;

            $scope.testcase.commonMap[id].calledComponents.forEach((element2) => {
                if(element2 === element1._id)
                    count++;
            });

            basic.push(count);
        });

        return basic;
    };


    /**
     *  Table Style
     */
    $scope.getComponentStepCountBGColorClass = function (component) {
        if($scope.project.selected !== undefined && $scope.showTable) {
            let avg = ($scope.maxStepCount - $scope.minStepCount)/3;

            if( ($scope.minStepCount + avg) > component )
                return 'bg-low-pri';
            else if( ($scope.minStepCount + (avg * 2) ) > component )
                return 'bg-medium-pri';
            else if( ($scope.minStepCount + (avg * 2) ) < component )
                return 'bg-high-pri';
        }
    };

    $scope.getComponentPriorityBGColorClass = function (usage) {
        if($scope.project.selected !== undefined && $scope.showTable) {
            let avg = ($scope.maxUsage - $scope.minUsage) /3;

            if( ($scope.minUsage + avg) > usage )
                return 'bg-low-pri';
            else if( ($scope.minUsage + (avg * 2)) > usage )
                return 'bg-medium-pri';
            else if( ($scope.minUsage + (avg * 2)) < usage )
                return 'bg-high-pri';
        }
    };

    $scope.project.dbRetrieve();
}
