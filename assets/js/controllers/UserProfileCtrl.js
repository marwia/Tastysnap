/**
 * assets/js/controllers/UserProfileCtrl.js
 *
 * Copyright 2016 Mariusz Wiazowski
 *
 * Controller usato per la pagina del profile di un qualsiasi utente.
 */
angular.module('UserProfileCtrl', []).controller('UserProfileCtrl', [
    '$scope',
    'User',
    '$state',
    'Recipe',
    'ImageUtils',
    'Auth',
    '$filter',
    'FileUploader', // per il file upload
    '$http',
    'toaster',
    function($scope, User, $state, Recipe, ImageUtils, Auth, $filter, FileUploader, $http, toaster) {
        // Espongo gli elementi del User service
        $scope.currentUser = User.currentUser;
        $scope.user = User.user;//utente del profilo
        $scope.getUserProfileImage = User.getUserProfileImage;//metodo per ottenere l'immagine del profilo


        // Espongo il metodo per determinare lo stato dell'app
        $scope.getCurrentState = function() {
            return $state.current.name;
        };

        /**
         * Gestione del pulsante per seguire l'utente:
         */

        // Testo sul pulsante per seguire una persona
        $scope.action = "SEGUI";
        $scope.toggleFollow = function(user) {
            if (user.isFollowed == true) {
                User.unfollowUser(user, function() {
                    //fatto
                })
            } else {
                User.followUser(user, function() {
                    //fatto
                })
            }
        }

        $scope.onMouseEnter = function() {
            if ($scope.user.isFollowed == true) {
                $scope.action = "SMETTI DI SEGUIRE";
            }
        }

        $scope.toggleAction = function() {
            $scope.action = "";
        }

        /**
         * Gestione del pulsante per cambiare l'immagine di copertina:
         */

        // File uploading (configuration)

        var coverImageUploader = $scope.coverImageUploader = new FileUploader({
            alias: 'image',
            method: 'put',
            url: '/api/v1/user/' + $scope.user.id + '/upload_cover_image',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
                'x-csrf-token': $http.defaults.headers.common['x-csrf-token']
            }
        });

        // FILTERS
        var coverImageFilter = {
            name: 'coverImageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';

                return '|jpg|png|jpeg|'.indexOf(type) !== -1 // filter file type
                    && this.queue.length < 1; // max 1 image
            }
        };

        // Set filters
        coverImageUploader.filters.push(coverImageFilter);

        // File upload callbacks
        coverImageUploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);

            ImageUtils.reduceImageSizeAndQuality(fileItem._file, 1024, 1024, 0.7, function(canvas, reducedFile) {

                // setto l'immagine di copertina...
                var dataUrl = canvas.toDataURL("image/jpeg", 1);
                $scope.user.coverImageUrl = dataUrl;

                // ottengo l'immagine ridotta
                fileItem._file = reducedFile;
                // avvia l'upload
                coverImageUploader.uploadAll();
            });
        };

        coverImageUploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);

        };

        coverImageUploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };

        $scope.test = function() {
            toaster.error("title", "text2");

            toaster.pop('success', "Copertina aggiornata", "aa");
        };

        //////////////////////////////////////////////

        // Inizializzazione del controller
        var init = function() {
            // verifico se l'utente visualizzato è seguito dall'utente loggato
            User.areYouFollowing($scope.user, $scope.toggleAction());
        };

        init();

    }]);