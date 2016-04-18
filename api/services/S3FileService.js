/**
 * S3FileService
 *
 * @description :: Piccola utility di funzioni per interagire con un
 *                 bucket AWS S3.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs');
var path = require('path');
var bucket = 'tastysnapcdn';
var aws = require('aws-sdk');
aws.config.loadFromPath('./aws_config.json');

var s3 = new aws.S3();

module.exports = {

    /**
     * Funzione per stampare la lista di tutti i 
     * file del bucket "tastysnapcdn".
     */
    listBuckets: function() {
        s3.listBuckets(function(error, data) {
            if (error) {
                console.log(error); // error is Response.error
            } else {
                console.log(data); // data is Response.data
            }
        });
    },
    
    /**
     * Funzione per caricare qualsiasi file inferiore a 10MB sul 
     * bucket 'tastysnapcdn'.
     * Tale file verrà reso disponibile a tutti in lettura tramite
     * la url: 'https://tastysnapcdn.s3.amazonaws.com/<nome_file>'
     * 
     * @param {File} file - file da caricare
     * @param {Function} whenDone - callback finale
     * 
     * NOTE: La funzione è sincrona.
     */
    uploadS3Object: function(file, whenDone) {

        fs.readFile(file.fd, function(err, data) {
            if (err) {
                return whenDone(err, null);
            }
            
            if (!data) {
                return whenDone(null, null);
            }
            
            var filename = file.fd.replace(/^.*[\\\/]/, '');
            
            var params = { 
                Bucket: bucket, 
                ContentType: file.type, 
                Key: filename, 
                Body: data 
            };
            
            s3.upload(params, whenDone);
        });
    },

    /**
     * Funzione per eliminare qualsiasi dal
     * bucket 'tastysnapcdn'.
     * L'eliminazione avviene per nome del file.
     * 
     * @param {String} filename - nomde del file da eliminare
     * @param {Function} whenDone - callback finale
     * 
     * NOTE: La funzione non è sincrona.
     */
    deleteS3Object: function(filename) {
        var params = {
            Bucket: bucket, /* required */
            Delete: { /* required */
                Objects: [ /* required */
                    {
                        Key: filename

                    },
                    /* more items */
                ],
                Quiet: true || false
            },
        };
        
        s3.deleteObjects(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);           // successful response
        });

    }

}