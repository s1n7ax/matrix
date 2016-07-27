let Promise = require('bluebird');

function test (){
  Promise.resolve(function () {
  }).then(function () {
    return 'hello';
  })
} 

Promise.resolve(function () {
}).then(function () {
  test()
}).then(function (data) {
  console.log(data);
})