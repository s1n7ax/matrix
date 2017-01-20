function restService($http) {

    let self = this;

    /**
     * Common
     */
    self.createItem = function (values) {
        return $http.post('/createItem', values);
    }



    /**
     * GET ITEMS
     */
    self.getAllProjects = function() {
        return $http.post('/getAllProjects');
    };

    self.getAllTestsuites = function (values) {
        return $http.post('/getAllTestsuites', values);
    };

    self.getAllTestcases = function (values) {
        return $http.post('/getAllTestCases', values);
    };

    self.getAllComponents = function (values) {
        return $http.post('/getAllComponents', values);
    };

    self.getAllLibraries = function (values) {
        return $http.post('/getAllLibraries', values);
    };

    self.getAllUsers = function (values) {
        return $http.post('/getAllUsers', values);
    };


    /**
     * CREATE ITEMS
     */
    self.createProject = function (values) {
        return $http.post('/createProject', values);
    };

    self.createTestsuite = function (values) {
        return $http.post('/createTestsuite', values);
    };

    self.createTestcase = function (values) {
        return $http.post('/createTestCase', values);
    };

    self.createComponent = function (values) {
        return $http.post('/createComponent', values)
    };

    self.createLibrary = function (values) {
        return $http.post('/createLibrary', values)
    }

    /**
     * UPDATE ITEMS
     */
    self.setTestcase = function (values) {
        return $http.post('/updateTestcase', values);
    }

    self.setComponent = function (values) {
        return $http.post('/setComponent', values);
    };


    /**
     * DELETE ITEM
     */
    self.deleteTestcase = function (values) {
        return $http.post('/deleteTestcase', values);
    }

    self.deleteComponent = function (values) {
        return $http.post('/deleteComponent', values);
    }

    self.deleteItem = function (values) {
        return $http.post('/deleteItem', values);
    }

    self.deleteItemAndChildren = function (values) {
        return $http.post('/deleteItemAndChildren', values)
    }



    /**
     * Rename
     */
    self.renameComponent = function (values) {
        return $http.post('/renameComponent', values);
    }

    self.renameTestcase = function (values) {
        return $http.post('/renameTestcase', values);
    }

    self.renameLibrary = function (values) {
        return $http.post('/renameLibrary', values);
    }

    self.renameTestsuite = function (values) {
        return $http.post('/renameTestsuite', values);
    }


    /**
     * OTHER
     */
    self.partialUpdate = function (values) {
        return $http.post('/partialUpdate', values)// : param {projectName, _id, val: {everything needs to be changed}}
    }

    self.getCommands = function () {
        return $http.get('/configuration/commands.json');
    }

};