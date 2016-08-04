let Promise = require('bluebird');

function test (){
    return new Promise(function (res, rej) {
        res('hello');
    });
}

function test1() {
    test().then(function () {
        // console.log('abc');
        throw new Error('test');
    }).catch(function () {
        console.log('error');
    }).finally(function () {
        console.log('finally');
    })
}

test1()