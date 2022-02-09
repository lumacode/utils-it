const moment = require('moment');
const fs = require('fs');
const spawn = require('child_process').spawn
const compressController = require ('./compressController');
const s3Controller = require('./s3Controller');

/**
* @param {Boolean} sqlBackup: true or false mysql backup script
* @param {String} dbName: name db
* @param {String} dbUser: user db
* @param {String} dbPassword: password db
* @param {String} backupPath: system directory to generate backup
* @param {String} s3Dir: s3 directory path to save backup
* @returns {}
*/

// You can adjust the backup frequency as you like, this case will run once a day
const generateBkController = async (sqlBackup=true, dbName, dbUser, dbPassword, backupPath, s3Dir) => {
  if(sqlBackup){
    console.log('Backup Init: '+moment().format('YYYY_MM_DD_hmmss'))
    // Use moment.js or any other way to dynamically generate file name
    const tmpName = moment().format('YYYY_MM_DD_hmmss');
    const fileName = `${dbName}_${moment().format('YYYY_MM_DD_hmmss')}.sql`;
    const wstream = fs.createWriteStream(`/${backupPath}/${fileName}`);
    console.log('-------------------------------------------------------------------');
    console.log('Running Database Backup Cron Job');
    const mysqldump = spawn('mysqldump', [ '-u', dbUser, `-p${dbPassword}`, dbName ]);

    mysqldump
      .stdout
      .pipe(wstream)
      .on('finish', async () => {
        await compressController.dir(backupPath, `tmp/${tmpName}.zip`);
        s3Controller.upload(`tmp/${tmpName}.zip`, `${s3Dir}/${tmpName}.zip`);
        console.log(`Backup ${backupPath} Completed!`)
        console.log('-------------------------------------------------------------------');
        console.log('Backup Finish: '+moment().format('YYYY_MM_DD_hmmss'))
      })
      .on('error', (err) => {
        console.log(err);
      })
  }else{
        await compressController.dir(backupPath, `tmp/${tmpName}.zip`);
        s3Controller.upload(`tmp/${tmpName}.zip`, `${s3Dir}/${tmpName}.zip`);
  }

}

module.exports = { generateBkController }