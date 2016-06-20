var fs = require('fs');
var path = require('path');


console.log(fs.lstatSync(path.join(__dirname, 'bin')).isFile());
