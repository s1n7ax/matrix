let Promise = require('bluebird');

function getItem(){

  Promise.resolve(function () {
  })
  .then(function () {
    getVal1(function (val) {
      console.log(val)
    });
  })
  
}


function getVal1(func){
  let a = 'getVal1';
  func(a);
}

getItem();