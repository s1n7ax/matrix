app.service('$libraryService', libraryService);

function libraryService($superService, $restService) {
    "use strict";

    angular.extend(libraryService.prototype, $superService);

    this.dbRetrieve = function (projectName, callback) {
        let self = this;

        $restService.getAllLibraries({
            projectName: projectName
        })
            .then(function successCallback(res) {
                if(res.data.status) {
                    console.log('\n');
					console.log('Getting all libraries - Successful!');
					console.log(res.data.val);
                    self._list = res.data.val;
                    if(callback)
                        callback();
                }
                else {
                    console.log('\n');
					console.error('Getting all libraries - Failed!');
					console.log(res.data.error);
                }
            },
            function errorCallback(error){
                console.log('\n');
                console.error('Getting all libraries - Failed!');
                console.log(error);
            })
    }


    this.selectMenuString = function () {
        if(this._selected !== null)
            return `Library : ${this._selected}`;
        else
            return 'Select a library';
    }


}