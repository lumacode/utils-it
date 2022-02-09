var fs = require('fs');
var archiver = require('archiver');

const compressController = {

    /**
    * @param {String} sourceDir: /some/folder/to/compress
    * @param {String} outPath: /path/to/created.zip
    * @returns {Promise}
    */
    dir : (sourceDir, outPath) => {
       
        const archive = archiver('zip', { zlib: { level: 9 }});
        const stream = fs.createWriteStream(outPath);

        return new Promise((resolve, reject) => {
            archive
            .directory(sourceDir, false)
            .on('error', err => reject(err))
            .pipe(stream)
            ;

            stream.on('close', () => resolve());
            archive.finalize();
        });
    }
}

module.exports = compressController;




