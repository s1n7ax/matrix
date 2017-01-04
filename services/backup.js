const locator = require('../locator');
const fs = require('fs-extra');
const JsonFile = require('jsonfile');
const Nano = require('nano');
const path = require('path');

class Backup {
    constructor(timeInHours) {
        console.log('This is backup constructor');
        this.startBackup();
        setTimeout(this.startBackup, (1000*60*60*timeInHours));
    }

    startBackup () {
        console.log("\n************** Starting Backup **************");

        let date = new Date();
        let GMTString = date.toGMTString()


        while(GMTString.match(/\:/) !== null){
            GMTString = GMTString.replace(':', '-');
        }

        let fileName = 'Automate Backup '+GMTString;
        let targetFolderPathPath = path.join(locator.couchBackup.dbCopyTo, fileName);

        console.log('target path '+ targetFolderPathPath);
        console.log('source path '+ locator.couchBackup.dbSource);

        try {
            fs.copySync(locator.couchBackup.dbSource, targetFolderPathPath)
            console.log("Creating Backup "+fileName+" Successful!");
        } catch (err) {
            console.error("************** Creating Backup "+fileName+" failed! **************");
            console.error(err)
        }
    }



}

module.exports = new Backup(3);