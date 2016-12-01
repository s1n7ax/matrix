app.service('$testsuiteTreeService', testsuiteTreeService)

function testsuiteTreeService () {

    "use strict";

    this.get = function () {
        return this._list;
    };

    this.set = function (val) {
        this._list = val;
    };


    this.updateNode = function (id) {
        let map = new Object;

        map.testcase = id;
        map.components = testsuite.getLinkList(id);
        map.isExpanded = false

        let index = this._list.findIndex(element => element.testcase === id);

        if(~index) {
            map.isExpanded = this._list[index].isExpanded;
            this._list.splice(index, 1, map);
        }
        else {
            this._list.push(map);
        }
    };
    

    this.removeNode = function (id) {
        this._list.filter(element => element.testcase !== id)
    };
};