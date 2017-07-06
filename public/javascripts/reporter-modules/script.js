reporter.controller('reporter_ctrl', reporterCtrl);
reporter.service('$restService',restService);

function reporterCtrl ($scope, $restService, $mdDialog, $timeout) {




    /**
     * Common Properties
     */
    $scope.applicationName = 'BC Creator Reporter';

    $scope.maxStepCount;
    $scope.minStepCount;

    $scope.maxUsage;
    $scope.minUsage;




    /**
     * Dialog
     */
    $scope.dialog = new Object();
    $scope.dialog.openErrorPromptDialog = function (error) {
            let config = {
                controller: ErrorPromptDialogCtrl,
                controllerAs: 'ctrl',
                templateUrl: 'templates/error-dialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                locals: {
                     lscope: $scope,
                     error: error
                }
            };

            $mdDialog.show(config);


            function ErrorPromptDialogCtrl ($scope, lscope, error) {
                let self = this;

                $scope.error = error.error;
                $scope.message = error.message;

                self.ok = function ($event) {
                    //$mdDialog.hide();
                }
                self.cancel = function($event) {
                    //$mdDialog.cancel();
                };
            }
        };
    $scope.dialog.openErrorPromptDialog_callback = function (){
    }


    /**
     * Datatable
     */
    $scope.dttable = new Object();
    $scope.dttable.showCustomTable = function () {
        var table = $('#metrix');
        table.DataTable({
            "paging":   false,
            "ordering": false,
            "info":     false
        });

        table.css({ 'visibility': "visible" });

        let searchInput = document.evaluate('//div[@id=\'metrix_filter\']/label', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        searchInput.style.float = "left";
    }






    /**
     * Project
     */
    $scope.showTable = false;
    $scope.project = {};
    $scope.project.list;
    $scope.project.selected;

    $scope.project.getSelectMenuString = function () {
        return $scope.project.selected ? 'Project : '+$scope.project.selected : 'Select A Project';
    };

    $scope.project.dbRetrieve = function () {
        $restService.getAllProjects()
        .then(
        function successCallback(res) {
            if(res.data.status) {
                logger('success', 'Getting All Project - Successful!', res.data);
                $scope.project.list = res.data.val;
            }
            else{
                logger('error', 'Getting All Project - Failed!', res.data.error);
                $scope.dialog.openErrorPromptDialog({
                    error: res.data.error.error,
                    message: res.data.error.message,
                });
            }

        },
        function errorCallback(error) {
            logger('error', 'Getting All Project - Failed!', error);
            $scope.dialog.openErrorPromptDialog({
                error: error.error,
                message: error.message,
            });
        });
    };

    $scope.project.onChange = function () {
        if($scope.project.selected) {

            /**
             * Getting all components
             */
            $restService.getAllComponents({
                projectName: $scope.project.selected
            })
            .then(function successCallback(res) {
                if(res.data.status){
                    logger('success', 'Getting All Components - Successful!', res.data);
                    $scope.component.list = res.data.val;
                }
                else {
                    logger('error', 'Getting All Components - Failed!', res.data.error);
                    $scope.dialog.openErrorPromptDialog({
                        error: res.data.error.error,
                        message: res.data.error.message,
                    });
                }
            }, function errorCallback (error) {
                logger('error', 'Getting All Components - Failed!', error);
                $scope.dialog.openErrorPromptDialog({
                    error: error.error,
                    message: error.message,
                });
            })


            /**
             * Getting all testcases
             */
            .then(function () {
                return $restService.getAllTestcases({
                    projectName: $scope.project.selected
                });
            })
            .then(function (res) {
                if(res.data.status){
                    logger('success', 'Getting All Testcases - Successful!', res.data);
                    $scope.testcase.list = res.data.val;
                }
                else {
                    logger('error', 'Getting All Testcases - Failed!', res.data.error);
                    $scope.dialog.openErrorPromptDialog({
                        error: res.data.error.error,
                        message: res.data.error.message,
                    });
                }
            })


            /**
             * Setting all Maps
             */
            .then(function () {
                $scope.component.setCommonMap();
                $scope.testcase.setCommonMap();
                $scope.component.setStepCountMaxAndMin();
                $scope.component.setUsageMaxAndMin();
                $scope.showTable = true;
                $scope.matrix.setTCMatrix();

            }).then(function (){
                $timeout($scope.dttable.showCustomTable, 0);
            });
        }
    };




    /**
     * Component
     */
    $scope.component = {};
    $scope.component.list;
    $scope.component.getObj = function(id) {
        return $scope.component.list.find(e => e._id === id);
    };

    $scope.component.setCommonMap = function () {
        logger('logHeader', 'Setting Component map - Starting!');
        let obj = {};

        for(let i=0, list=$scope.component.list, len=list.length; i < len; i++){
            let ele = list[i];

            logger('logSub', 'Setting component map of ' + ele._id + ' - Starting!', ele);

            obj[ele._id] = {};
            obj[ele._id]['status'] = ele.status;
            let calledCmpAndStepCount = $scope.component.getStepCountAndCalledCmpByContent(ele._id, ele.content, obj);
            obj[ele._id]['stepCount'] = calledCmpAndStepCount.stepCount;
            obj[ele._id]['calledComponents'] = calledCmpAndStepCount.calledComponents;
            obj[ele._id]['owner'] = list[i].owner;

            logger('logSub2', ele._id + ' status: ' + obj[ele._id]['status']);
            logger('logSub2', ele._id + ' step count: ' + obj[ele._id]['stepCount']);
            logger('logSub2', ele._id + ' called components: ' + obj[ele._id]['calledComponents']);
            logger('logSub2', ele._id + ' owner: ' + obj[ele._id]['owner']);
        }

        $scope.component.commonMap = $scope.component.getUsageFromCommonMap(obj);
        logger('success', 'Setting Component map - Finished!');
    };

    $scope.component.getStepCountById = function (id, tempMap) {
        let obj = $scope.component.getObj(id);

        //No component named "id" in the list
        if(!obj){
            let errorHeader = 'Invalid component name';
            let errorMsg = 'Error while getting step count of' + id + '.\n Unable to find component in the component list';
            logger('error',
                errorHeader,
                errorMsg,
                $scope.component.list);

            $scope.dialog.openErrorPromptDialog({
                error: errorHeader,
                message: errorMsg
            });
        }

        //Fond component named "id"
        else
            return obj.content ? $scope.component.getStepCountAndCalledCmpByContent(id, obj.content, tempMap).stepCount : 0;
    };

    currentComponent = [];
    $scope.component.getStepCountAndCalledCmpByContent = function (id, content, tempMap) {

        //Verify there is no recursion in the call chain. if there is "id" in the "currentComponent"
        //means currently we are counting the steps of the id.
        if(~currentComponent.indexOf(id)){
            let errorHeader = 'Component Call Recursion';

            path = "";
            for(let i = 0, len = currentComponent.length; i < len; i++){
                path += currentComponent + "->";
            }
            path += id;

            let errorMsg = 'Component ' + id + 'call itself.\nRemove the recursion to get the step count.' +
                '\nconsider the below path to find the component call\n' + path;
            logger('error',
                errorHeader,
                errorMsg,
                currentComponent);

            $scope.dialog.openErrorPromptDialog({
                error: errorHeader,
                message: errorMsg
            });
        }

        //No recursive components
        else if(!content){
            let stepCount = 0;
            let calledComponents = [];

            return {stepCount: stepCount, calledComponents: calledComponents};
        }
        else{
            currentComponent.push(id);
            let stepCount = 0;
            let calledComponents = [];

            //Reading statements line by line
            for(let i = 0, list = content.split('\n'), len = list.length;
                i < len; i++){

                //Removing spaces in the line start and line end
                list[i].replace(/^\s+|\s+$/g, '');

                //Ignore lines with spaces
                if(NO_SPACE_REGEX.test(list[i])){

                    //Consider lines starts with a call command
                    if(STARTS_WITH_CALL_REGEX.test(list[i])){
                        try{
                            let comp_id = $scope.component.getIdFromCallStatement(list[i]);

                            //If step count already found in the tempMap, it will be used.
                            try{
                                assertNotEqual(tempMap[comp_id], undefined);
                                assertNotEqual(tempMap[comp_id].stepCount, undefined);
                                stepCount += tempMap[comp_id].stepCount;
                            }
                            catch(err){
                                stepCount += $scope.component.getStepCountById(comp_id, tempMap);
                            }
                            finally{
								//adding the count of the call command 
								stepCount += 1;
                                calledComponents.push(comp_id);
                            }
                        }catch(err){
                            console.error(err);
                            err.name += ' - Error occurred while getting step count of ' + id + ' in line ' + i;

                            logger('error', err.name, err.message);

                            $scope.dialog.openErrorPromptDialog({
                                error: err.name,
                                message: err.message
                            });
                        }
                    }

                    //Consider lines don't start with a call command
                    else if(STARTS_WITH_COMMAND_REGEX.test(list[i])){
                        stepCount += 1;
                    }

                    //all the other steps will be ignored
                }
            }
            //Remove last element of the array
            currentComponent.pop();
            return {stepCount: stepCount, calledComponents: calledComponents};
        }
    }

    //Uses component common map to get the max and min steps count
    /**************************************************************************/
    $scope.component.setStepCountMaxAndMin = function () {

        //Get the keys array
        let keys = Object.keys($scope.component.commonMap);

        $scope.maxStepCount = $scope.component.commonMap[keys[0]].stepCount;
        $scope.minStepCount = $scope.maxStepCount;

        for(let i = 0, list = keys, len = list.length; i < len; i++) {
            let stepC = $scope.component.commonMap[list[i]].stepCount;

            if(stepC > $scope.maxStepCount)
                $scope.maxStepCount = stepC;
            if(stepC < $scope.minStepCount)
                $scope.minStepCount = stepC;
        }
    };

    //Uses component common map to get the max and min usage
    /**************************************************************************/
    $scope.component.setUsageMaxAndMin = function () {
        let keys = Object.keys($scope.component.commonMap);

        $scope.maxUsage = $scope.component.commonMap[keys[0]].usage;
        $scope.minUsage = $scope.maxUsage;

        for(let i = 0, list = keys, len = list.length; i < keys.length; i++) {
            let usageC = $scope.component.commonMap[keys[i]].usage;

            if(usageC > $scope.maxUsage)
                $scope.maxUsage = usageC;
            if(usageC < $scope.minUsage)
                $scope.minUsage = usageC;
        }
    };

    //Uses component common map to get the usage of a method
    $scope.component.getUsageFromCommonMap = function (map) {
        let keys = Object.keys(map);
        for(let i=0, list1=keys, len1=list1.length; i<len1; i++){
            map[list1[i]]['usage'] = 0;
            for(let j=0; j<len1; j++){
                for(let v=0, list2=map[list1[j]]['calledComponents'], len2=list2.length; v<len2; v++){
                    if(list1[i] === list2[v]){
                        map[list1[i]]['usage'] += 1;
                    }
                }
            }
        }
        return map;
    }

    $scope.component.getIdFromCallStatement = function(statement){
        let arr = statement.split(/\s/g);

        if(arr.length < 2){
            let error = new Error();
            error.name = 'NoSpaceAfterCall';
            error.message = 'Please follow the standard syntax to call a component. Use a space to seperate <command> and <library.component>';
            throw error;
        }

        if(!NO_SPACE_REGEX.test(arr[1])){
            let error = new Error();
            error.name = 'NoValueAfterCall';
            error.message = 'Please use library and component name to specify the component should be called after Call command. Use a dot(.) to seperate library and component. call <library.component>';
            throw error;
        }

        let path = arr[1].split('.');

        if(path.length < 2){
            let error = new Error();
            error.name = 'NoComponentAfterCall';
            error.message = 'Please use library and component name to specify the component should be called after Call command. Use a dot(.) to seperate library and component. call <library.component>';
            throw error;
        }

        if(path.length > 2){
            let error = new Error();
            error.name = 'InvalideNumberOfArgumentsAfterCall';
            error.message = 'Please use only library and component name to specify the component should be called after Call command. Use a dot(.) to seperate library and component. call <library.component>';
            throw error;
        }

        return path[1];
    }






    /**
     * Testcases
     */
    $scope.testcase = {};
    $scope.testcase.list;
    $scope.testcase.commonMap;


    $scope.testcase.setCommonMap = function () {
        let obj = {};
        logger('logHeader', 'Setting Testcase map - Starting!');
        for(let i=0, list=$scope.testcase.list, len=list.length; i<len; i++){
            let ele = list[i];
            logger('logSub', 'Setting testcase map of ' + ele._id + ' - Starting!', ele);

            obj[ele._id] = {};
            obj[ele._id]['owner'] = ele.owner;
            let stepCountCalledCmpAndStatementMap = $scope.testcase.getSCCalledCmpAndStatements(ele._id, ele.content);
            obj[ele._id]['stepCount'] = stepCountCalledCmpAndStatementMap.stepCount;
            obj[ele._id]['calledComponents'] = stepCountCalledCmpAndStatementMap.calledComponents;
            obj[ele._id]['calledStatements'] = stepCountCalledCmpAndStatementMap.calledStatements;
            obj[ele._id]['status'] = $scope.testcase.getStatus($scope.project.selected, ele._id, ele.status, obj[ele._id]['calledComponents']);
            obj[ele._id]['complexity'] = $scope.testcase.getComplexityByStepCount(obj[ele._id]['stepCount']);

            logger('logSub2', ele._id + ' owner: ' + obj[ele._id]['owner']);
            logger('logSub2', ele._id + ' step count: ' + obj[ele._id]['stepCount']);
            logger('logSub2', ele._id + ' called components: ' + obj[ele._id]['calledComponents']);
            logger('logSub2', ele._id + ' called statements: ' + obj[ele._id]['calledStatements']);
            logger('logSub2', ele._id + ' status: ' + obj[ele._id]['status']);
            logger('logSub2', ele._id + ' complexity: ' + obj[ele._id]['complexity']);
        }

        $scope.testcase.updateComponentMapUsageForUsageInTC(obj);
        $scope.testcase.commonMap = obj;
        logger('success', 'Setting Testcase map - Finished!');
    };

    $scope.testcase.getSCCalledCmpAndStatements = function (id, content) {
		if(id && !content){
			content = "";
		}
        let steps = content.split('\n');
        let stepCount = 0;
        let calledComponents = [];
        let calledStatements = [];


        for(let i=0, list=steps, len=list.length; i<len; i++){
            let ele = list[i];

            ele.replace(/^\s+|\s+$/g, '');

            if(NO_SPACE_REGEX.test(ele)){

                //Consider lines starts with a call command
                if(STARTS_WITH_CALL_REGEX.test(ele)){
					let comp_id = undefined;
                    try{
                        comp_id = $scope.component.getIdFromCallStatement(ele);
                        assertNotEqual($scope.component.commonMap[comp_id], undefined);
                        assertNotEqual($scope.component.commonMap[comp_id].stepCount, undefined);

                        stepCount += $scope.component.commonMap[comp_id].stepCount;
						
						//adding  the call  command step
						stepCount += 1;
                        calledComponents.push(comp_id);
                    }
                    catch(err){
						let lineNumber = i + 1;
					
                        if(err.name === 'ActualIsExpected'){
                            err.name = 'Error while getting step count of Testcase ' + id + '\nLine number : ' + lineNumber;
                            err.message = 'Unable to find the component ' + comp_id + ' of call command ' + ele + ' in the component list';

                            logger('error', err.name, err.message, $scope.component.commonMap);

                            $scope.dialog.openErrorPromptDialog({
                                error: err.name,
                                message: err.message
                            });
                        }
                        else {
                            err.message += '\nTestcase: ' + id;
                            err.message += '\nLine Number: ' + lineNumber;

                            logger('error', err.name, err.message);

                            $scope.dialog.openErrorPromptDialog({
                                error: err.name,
                                message: err.message
                            });
                        }
                    }
                }

                //Consider lines don't start with a call command
                else if(STARTS_WITH_COMMAND_REGEX.test(ele)){
                    stepCount += 1;
                    calledStatements.push(ele);
                }
            }
        }

        return {
            stepCount: stepCount,
            calledComponents: calledComponents,
            calledStatements: calledStatements
        }

        $scope.component.getIdFromCallStatement();
    }

    /**************************************************************************/
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
                        status: 'Ready to automate'
                    }
                })
                .then(function (res) {
                    console.log(id);
                    if(res.data.status) {
                        successLog('Updating '+id+' status to "Ready to automate" - Successful!', res.data);
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

    /**************************************************************************/
    $scope.testcase.getComplexityByStepCount = function (stepCount) {
        if(stepCount > 80)
            return 'H+';
        else if(stepCount > 40)
            return 'H';
        else if(stepCount > 20)
            return 'M';
        else if(stepCount > 0)
            return 'L';
        else
            return 'None';
    };

    //uses $scope.component.commonMap and tcCommonMap
    $scope.testcase.updateComponentMapUsageForUsageInTC = function (tcMap) {
        tcKeys = Object.keys(tcMap);
        bcKeys = Object.keys($scope.component.commonMap);

        for(let i=0, list1=bcKeys, len1=bcKeys.length; i<len1; i++){
            let cmp = $scope.component.commonMap[list1[i]];

            for(let j=0,list2=tcKeys, len2=tcKeys.length; j<len2; j++){
                let tc = tcMap[list2[j]];


                for(let v=0, list=tc['calledComponents'], len=list.length; v<len; v++){
                    if(list[v] === list1[i])
                        $scope.component.commonMap[list1[i]]['usage'] += 1;
                }
            }
        }
    }




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
            $scope.testcase.commonMap[id].calledComponents.length
        ];

        $scope.component.list.forEach((element1) => {
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
