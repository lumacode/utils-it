const AWS = require('aws-sdk');
const fs = require('fs');
const cfg = require('../config');


const s3Controller = {

/**
* @param {String} file: 
* @param {String} s3Key: 
* @returns {}
*/

    upload : (file, s3Key) => {
        // s3 config
        const spacesEndpoint = new AWS.Endpoint(cfg.s3EndPoint);
        const s3 = new AWS.S3({endpoint: spacesEndpoint, accessKeyId: cfg.s3AccessKeyId, secretAccessKey: cfg.s3SecretAccessKey });

        // upload object s3 putObject
        const fileStream = fs.createReadStream(file);
        fileStream.on('error', function (err) {
        if (err) { throw err; }
        });  
        fileStream.on('open', function () {
        s3.putObject({
            Bucket: cfg.s3BucketName,
            Key: s3Key,
            Body: fileStream
        }, function (err) {
            if (err) { throw err; }
            //TODO delete tmp file 
        });
        });
    }

}

module.exports = s3Controller;