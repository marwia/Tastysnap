/**
 * ImageUploadService
 *
 * @description :: Piccola utility di funzioni per l'upload delle immagini.
 * @help        :: See http://links.sailsjs.org/docs/services
 */

var md5 = require('md5');
var fs = require('fs');

var awsS3Config = require('./config/aws_s3.json');

// setting allowed file types
var allowedTypes = ['image/jpeg', 'image/png'];
// skipper default upload directory .tmp/uploads/
var localImagesDir = sails.config.appPath + "/assets/images";

module.exports = {

    localImagesDir: localImagesDir,

    /**
    * Funzioni comuni nell'upload di immagini
    */
    localUploadConfiguration: {
        // don't allow the total upload size to exceed ~5MB
        maxBytes: 5000000,
        saveAs: function (file, cb) {
            var d = new Date();
            var extension = file.filename.split('.').pop();

            if (extension == 'blob') { extension = 'jpg'; }
            // generating unique filename with extension
            var uuid = md5(d.getMilliseconds()) + "." + extension;

            console.log(file.headers['content-type']);
            // seperate allowed and disallowed file types
            if (allowedTypes.indexOf(file.headers['content-type']) === -1) {
                // don't accept not allowed file types
                return res.badRequest('Not supported file type');
            } else {
                // save as allowed files
                cb(null, localImagesDir + "/" + uuid);
            }
        }
    },

    /**
     * Funzione per cancellare le immagini locali.
     * Usato solo in fase di sviluppo.
     */
    deleteLocalImage: function (filename) {
        fs.unlink(localImagesDir + "/" + filename, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("File deleted successfully!");
        });
    },

    /**
     * Upload su un bucket S3.
     */
    s3Upload: function (err, filesUploaded, whenDone) {
        if (err) {
            return res.badRequest();
        }
        // If no files were uploaded, respond with an error.
        if (filesUploaded.length === 0) {
            return res.badRequest('No file was uploaded');
        }

        // eseguo l'upload dell'immagine sul bucket S3
        S3FileService.uploadS3Object(filesUploaded[0], function (err, uploadedFiles) {

            if (err || !uploadedFiles) {
                return res.badRequest("Errore nell'upload del file sul bucket S3");
            }

            var filename = filesUploaded[0].fd.replace(/^.*[\\\/]/, '');
            var fileUrl = awsS3Config.url + filename;

            // elimino il file temporaneo
            fs.unlink(filesUploaded[0].fd, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log("File deleted successfully!");
            });

            whenDone(fileUrl);
        });
    }


}