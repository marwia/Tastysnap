/**
 * assets/js/services/ImageService.js
 *
 * Mariusz Wiazowski
 *
 * Service usato per gestire le manipulazioni di immagini
 */

angular.module('ImageUtilsService', [])
    .factory('ImageUtils', ['$http', 'Auth', 'User', function($http, Auth, User) {

        var server_prefix = '/api/v1';

        // service body    
        var o = {};
        
        /**
         * Ricava le dimensioni dell'immagine riducendola proporzionalmente.
         * @param {Image} img
         * @param {Int} MAX_WIDTH
         * @param {Int} MAX_HEIGHT
         * @return {Object} sizes
         */
        o.setImageSize = function (img, MAX_WIDTH, MAX_HEIGHT) {
            var width = img.width;
            var height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            return { width: width, height: height };
        }
        
        /**
         * Converts data uri to Blob. Necessary for uploading.
         * @see
         *   http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
         * @param  {String} dataURI
         * @return {Blob}
         */
        o.dataURItoBlob = function (dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], { type: mimeString });
        }
        
        /**
         * Serve a ridurre la qualità e la risoluzione di un elemento del 
         * file uploader.
         * @param {FileItem} fileItem
         * @param {Function} successCallback(canvas)
         */
         o.reduceImageSizeAndQuality = function (file, MAX_WIDTH, MAX_HEIGHT, quality, successCallback, beforeCallback) {
                         
            // Crea il canvas
            var canvas = document.createElement("canvas");
            // Create a file reader
            var reader = new FileReader();
            
            // Set the image once loaded into file reader
            reader.onload = function (e) {
                // Create an image
                var img = document.createElement("img");
                img.onload = onLoadImage;
                img.src = e.target.result;
            }

            reader.readAsDataURL(file);

            function onLoadImage() {
                // Setta le massime dimensioni
                var sizes = o.setImageSize(this, MAX_WIDTH, MAX_HEIGHT);
                canvas.width = sizes.width;
                canvas.height = sizes.height;
                
                if (beforeCallback) 
                    beforeCallback(this, canvas);
                else {
                    // Trasforma il file in canvas
                    canvas.getContext("2d").drawImage(this, 0, 0, sizes.width, sizes.height);
                }
                
                // Comprimi il canvas in JPEG e riduci qualità
                var dataUrl = canvas.toDataURL("image/jpeg", quality);
                
                // Transofm to blob
                var blob = o.dataURItoBlob(dataUrl);

                if (successCallback)
                    successCallback(canvas, blob);
                    
                //return blob;
            }
        }

        return o;
    }]);