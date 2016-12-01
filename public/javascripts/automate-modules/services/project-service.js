app.service('$projectService', projectService);

function projectService ($restService, $superService) {
	angular.extend(projectService.prototype, $superService);

	/* Getters Setters */
	this.nameList =function () {
		return this._list.map(function (element) {
			return element;
		});
	};

	/* Functions */
	this.add = function (val) {
		console.log(`Adding '${val}' project!`);
		this._list.push(val);
	};

	this.remove = function (val) {
		console.log(`Removing '${val}' project!`);
		this._list = this._list.filter(element => element !== val);
	};

	this.selectMenuString = function () {
		if(this._selected !== null)
			return `Project : ${this._selected}`;
		else
			return 'Select a project';
	};

	this.dbRetrieve = function () {
        let self = this;

        $restService.getAllProjects()
            .then(
                function successCallback(res) {
                    if(res.data.status) {
                    	console.log('\n');
                        console.log('Getting all projects - Successful!');
                        console.log(res.data.val);
                        self._list = res.data.val;
                    }
                    else {
                        console.error('Getting all projects - Failed!');
                        console.log(res.data.error);
                    }
            },  function errorCallback(error) {
                    console.error('Getting all projects - Failed!');
                    console.log(error);
            });
    };
};