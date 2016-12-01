app.service('$superService', superService);

function superService($restService) {

    "use strict";


	/* Local Functions */
    this.set = function (objList) {
    	this._list = objList;
    };

    this.get = function () {
    	return this._list;
    };

    this.getSelected = function () {
        return this._selected;
    };



    this.setSelected = function (val) {
        console.log('\n');
        console.log(`Selecting: Item ${val}`);
        this._selected = val;
    };

    this.nameList = function () {
    	return this._list.map(function (element) {
    		return element._id;
    	});
    };

    this.add = function (obj) {
    	let index = this._list.findIndex(element => element._id === obj._id);

    	if(index === -1) {
    	    console.log('\n');
    		console.log(`Adding: '${obj._id}' ${obj.type} `);
    		this._list.push(obj);
    	}
    	else {
    	    console.log('\n');
    		console.log(`Updating: '${obj._id}' ${obj.type} `);
    		this._list.splice(index, 1, obj);
    	}
    };

    this.remove = function (id) {
        console.log('\n');
    	console.log(`Removing '${id}'`);
    	this._list = this._list.filter(element => element._id !== id);
    };

    this.getObj = function (id) {
    	return this._list.find(element => element._id === id);
    }

    this.getLinkList = function (id) {
    	let result = this._list.find(element => element._id === id).links;
        if(result) 
            return result;
        else
            return new Array();
        
    };

}