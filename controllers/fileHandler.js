var FS = require('fs');
var Path = require('path');
var Jsonfile = require('jsonfile');



var fileHandler = function () {};

fileHandler.prototype.projectContainerDirPath = Path.join(__dirname, '../projects');
fileHandler.prototype.projectDirPath = null;
fileHandler.prototype.projectFilePath = null;
fileHandler.prototype.moduleFilePath = null;
fileHandler.prototype.tcFilePath = null;
fileHandler.prototype.bcDir = null;
fileHandler.prototype.bcFilePath = null;

fileHandler.prototype.itemType = null;
fileHandler.prototype.fileObject = null;

var logFilePath = Path.join(__dirname, '..', 'log', 'project.log');


/***********************************Interface***********************************/
fileHandler.prototype.setUserException = function(name, message) {
    this.name = name;
    this.message = message;
  
};

fileHandler.prototype.log = function (logContent) {

  console.log(logContent);
  //logWriter.write(logContent+'\n');
  
  FS.writeFileSync(logFilePath, logContent,'utf8', '0o666', 'a');
  FS.writeFileSync(logFilePath, 'something','utf8', '0o666', 'a');
};

fileHandler.prototype.setPaths = function (projectName) {
  
  /* all projects are stored in this folder */
  this.projectContainerDirPath = Path.join(__dirname, '../projects');
  
  /* project files are stored in this dir */
  this.projectDirPath = Path.join(this.projectContainerDirPath, projectName);
  
  /* project file paths */
  this.projectFilePath = Path.join(this.projectDirPath, 'project.json');
  this.moduleFilePath = Path.join(this.projectDirPath, 'module.json');
  this.tcFilePath = Path.join(this.projectDirPath, 'tc.json');
  this.bcFilePath = Path.join(this.projectDirPath, 'bc.json');
  
  this.log('paths are set!');
};

fileHandler.prototype.createItem = function (itemName) {
  
  var filteredObject = this.fileObject.filter(event => event.name === itemName);
  var newItem = {name:itemName};
  var exceptionType;
  var errorMessage;
  
  if(filteredObject.length === 0){
    
    this.fileObject.push(newItem);
    this.log('Item "'+itemName+'" is created in "'+this.itemType+'" file!');
  }
  else if(filteredObject.length > 1){
    
    exceptionType = 'DuplicateItemsException : ';
    errorMessage = 
      filteredObject.length+' duplicates of item "'
      +itemName+'" in "'
      +this.itemType+'" file!';
    this.log(exceptionType + errorMessage);
    
    throw new this.setUserException(exceptionType, errorMessage);
  }
  else{
    
    exceptionType = 'ItemAlreadyExistException : ';
    errorMessage = 'Item "'+itemName+'" already exist in "'+this.itemType+'" file!';
    this.log(exceptionType + errorMessage);

    throw new this.setUserException(exceptionType, errorMessage);
  }
};

fileHandler.prototype.deleteItem = function (itemName) {
  
  var filteredObject = this.fileObject.filter(event => event.name !== itemName);
  var exceptionType;
  var errorMessage;
  var noOfItemsFound = this.fileObject.length - filteredObject.length;
  
  if(noOfItemsFound  === 1){
    this.fileObject = filteredObject;
    this.log('Item "'+itemName+'" is deleted from "'+this.itemType+'" file!');
  }
  else if(noOfItemsFound > 1){
    
    exceptionType = 'DuplicateItemsException';
    errorMessage = 
      noOfItemsFound+' duplicates of item "'
      +itemName+'" in "'
      +this.itemType+'" file!';
    this.log(exceptionType + errorMessage);
    
    throw new this.setUserException(exceptionType, errorMessage);
  }
  else{
    
    exceptionType = 'ItemNotFoundException';
    errorMessage = 'Item "'
      +itemName+'" is not found in "'
      +this.itemType+'" file';
      this.log(exceptionType + errorMessage);
    
    throw new this.setUserException(exceptionType, errorMessage);
  }
};

fileHandler.prototype.updateItem = function (itemName) {
  
  var filteredObject = this.fileObject.filter(event => event.name === itemName);
  var exceptionType;
  var errorMessage;
  
  if(filteredObject.length  === 1){
    
    this.fileObject =
    this.fileObject.reduce((previousVal, currentVal) => currentVal.name !== previousVal.push(currentVal), []);
    this.log('Item "'+itemName+'" is deleted from "'+this.itemType+'" file!');
  }
  else if(filteredObject.length > 1){
    
    exceptionType = 'DuplicateItemsException';
    errorMessage = 
      filteredObject.length+' duplicates of item "'
      +itemName+'" in "'
      +this.itemType+'" file!';
    this.log(exceptionType + errorMessage);
    
    throw new this.setUserException(exceptionType, errorMessage);
  }
  else{
    
    exceptionType = 'ItemNotFoundException';
    errorMessage = 'Item "'
    +itemName+'" is not found in "'
    +this.itemType+'" file';
    this.log(exceptionType + errorMessage);
    
    throw new this.setUserException(exceptionType, errorMessage);
  }
};

fileHandler.prototype.addItem = function(itemName, position){};




/***********************************ProjectModule***********************************/
var projectModule = function () {};
projectModule.prototype = Object.create(fileHandler.prototype);

projectModule.prototype.readFileObject = function () {
  this.itemType = 'module';
  this.fileObject = Jsonfile.readFileSync(this.moduleFilePath);
};

projectModule.prototype.writeFileObject = function () {
  Jsonfile.writeFileSync(this.moduleFilePath, this.fileObject);
};

projectModule.prototype.create = function (projectName, itemName) {
  
  this.setPaths(projectName);
  this.readFileObject();
  this.createItem(itemName);
  this.writeFileObject();
};

projectModule.prototype.delete = function (projectName, itemName) {
  this.setPaths(projectName);
  this.readFileObject();
  this.deleteItem(itemName);
  this.writeFileObject();
}

projectModule.prototype.addTC = function(projectName, moduleName, itemName, position) {
  
  this.setPaths(projectName);
  this.readFileObject();
  
  var exceptionType;
  var errorMessage;
  var tcFileObject = Jsonfile.readFileSync(this.tcFilePath);
  var filteredTCObject = tcFileObject.filter(event=>event.name === itemName);
  var filteredModuleObject = this.fileObject.filter(event=>event.name === moduleName);
  
  if(filteredTCObject.length === 1 && filteredModuleObject.length === 1){
    
    for(var i = 0; i < this.fileObject.length; i++){
      
      if(this.fileObject[i].name === moduleName){
        
        try{
          if(position <= this.fileObject[i].tc.length){
            this.fileObject[i].tc.splice(position, 0, itemName);
            console.log('Item "'+itemName+'" added to the module "'+moduleName+'"');
          }else{
            console.log('position is not valide');
          }
          break;
        }catch(e){
          this.fileObject[i].tc = [];
          if(position <= this.fileObject[i].tc.length){
            this.fileObject[i].tc.splice(position, 0, itemName);
            console.log('Item "'+itemName+'" added to the module "'+moduleName+'"');
          }else{
            console.log('position is not valide');
          }
          break;
        }
      }
    }
    console.log(this.fileObject);
    this.writeFileObject();
  }
  else if(filteredTCObject.length > 1){
    
    exceptionType = 'DuplicateItemsException';
    errorMessage = 
      filteredTCObject.length+' duplicates of item "'
      +itemName+'" in "tc" file!';
    throw new this.setUserException(exceptionType, errorMessage);
  }
  else if(filteredModuleObject.length > 1){
    
    exceptionType = 'DuplicateItemsException';
    errorMessage = 
      filteredModuleObject.length+' duplicates of item "'
      +moduleName+'" in "'
      +this.itemType+'" file!';
    throw new this.setUserException(exceptionType, errorMessage);
  }
  else if(filteredTCObject.length < 1){
    
    exceptionType = 'ItemNotFoundException';
    errorMessage = 'Item "'
      +itemName+'" is not found in "tc" file';
      this.log(exceptionType + errorMessage);
    throw new this.setUserException(exceptionType, errorMessage);
  }
  else if(filteredModuleObject.length < 1){
    
    exceptionType = 'ItemNotFoundException';
    errorMessage = 'Item "'
      +moduleName+'" is not found in "'
      +this.itemType+'" file';
      this.log(exceptionType + errorMessage);
    throw new this.setUserException(exceptionType, errorMessage);
  }
};




/***********************************ProjectTC***********************************/

var projectTC = function () {};
projectTC.prototype = Object.create(fileHandler.prototype);

projectTC.prototype.readFileObject = function () {
  this.itemType = 'tc';
  this.fileObject = Jsonfile.readFileSync(this.tcFilePath);
};

projectTC.prototype.writeFileObject = function () {
  Jsonfile.writeFileSync(this.tcFilePath, this.fileObject);
};

projectTC.prototype.create = function (projectName, itemName) {
  
  this.setPaths(projectName);
  this.readFileObject();
  this.createItem(itemName);
  this.writeFileObject();
};

projectTC.prototype.delete = function (projectName, itemName) {
  this.setPaths(projectName);
  this.readFileObject();
  this.deleteItem(itemName);
  this.writeFileObject();
}

projectTC.prototype.addBC = function(projectName, tcName, itemName, position) {
  
  this.setPaths(projectName);
  this.readFileObject();
  
  var exceptionType;
  var errorMessage;
  var bcFileObject = Jsonfile.readFileSync(this.bcFilePath);
  var filteredBCObject = bcFileObject.filter(event=>event.name === itemName);
  var filteredModuleObject = this.fileObject.filter(event=>event.name === tcName);
  
  if(filteredBCObject.length === 1 && filteredModuleObject.length === 1){
    
    for(var i = 0; i < this.fileObject.length; i++){
      
      if(this.fileObject[i].name === tcName){
        
        try{
          if(position <= this.fileObject[i].tc.length){
            this.fileObject[i].tc.splice(position, 0, itemName);
            console.log('Item "'+itemName+'" added to the test case "'+tcName+'"');
          }else{
            console.log('position is not valide');
          }
          break;
        }catch(e){
          this.fileObject[i].tc = [];
          if(position <= this.fileObject[i].tc.length){
            this.fileObject[i].tc.splice(position, 0, itemName);
            console.log('Item "'+itemName+'" added to the test case "'+tcName+'"');
          }else{
            console.log('position is not valide');
          }
          break;
        }
      }
    }
    console.log(this.fileObject);
    this.writeFileObject();
  }
  else if(filteredBCObject.length > 1){
    
    exceptionType = 'DuplicateItemsException';
    errorMessage = 
      filteredBCObject.length+' duplicates of item "'
      +itemName+'" in "bc" file!';
    throw new this.setUserException(exceptionType, errorMessage);
  }
  else if(filteredModuleObject.length > 1){
    
    exceptionType = 'DuplicateItemsException';
    errorMessage = 
      filteredModuleObject.length+' duplicates of item "'
      +tcName+'" in "'
      +this.itemType+'" file!';
    throw new this.setUserException(exceptionType, errorMessage);
  }
  else if(filteredBCObject.length < 1){
    
    exceptionType = 'ItemNotFoundException';
    errorMessage = 'Item "'
      +itemName+'" is not found in "bc" file';
      this.log(exceptionType + errorMessage);
    throw new this.setUserException(exceptionType, errorMessage);
  }
  else if(filteredModuleObject.length < 1){
    
    exceptionType = 'ItemNotFoundException';
    errorMessage = 'Item "'
      +tcName+'" is not found in "'
      +this.itemType+'" file';
      this.log(exceptionType + errorMessage);
    throw new this.setUserException(exceptionType, errorMessage);
  }
};


/***********************************ProjectBC***********************************/

var projectBC = function () {};
projectBC.prototype = Object.create(fileHandler.prototype);

projectBC.prototype.readFileObject = function () {
  this.itemType = 'bc';
  this.fileObject = Jsonfile.readFileSync(this.bcFilePath);
};

projectBC.prototype.writeFileObject = function () {
  Jsonfile.writeFileSync(this.bcFilePath , this.fileObject);
};

projectBC.prototype.create = function (projectName, itemName) {
  
  this.setPaths(projectName);
  this.readFileObject();
  this.createItem(itemName);
  this.writeFileObject();
};

projectBC.prototype.delete = function (projectName, itemName) {
  this.setPaths(projectName);
  this.readFileObject();
  this.deleteItem(itemName);
  this.writeFileObject();
};

projectBC.prototype.addContent = function(projectName, itemName, content){
  this.setPaths(projectName);
  this.readFileObject();
  for(var i = 0; i < this.fileObject.length; i++){
    if(this.fileObject[i].name === itemName){
      this.fileObject[i].content = content;
    }
  }
  this.writeFileObject();
};



var newModule = new this.ProjectModule();
var newTC = new this.projectTC();
var newBC = new this.projectBC();