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
    'toastr',
    '$uibModal',
    function($scope, User, $state, Recipe, ImageUtils, Auth, $filter, FileUploader, $http, toastr, $uibModal) {
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
        };

        $scope.onMouseEnter = function() {
            if ($scope.user.isFollowed == true) {
                $scope.action = "SMETTI DI SEGUIRE";
            }
        };

        $scope.toggleAction = function() {
            $scope.action = "";
        };

        // MODALE PER CONFERMARE L'ELIMINAZIONE DI UNA RICETTA

        $scope.openProfileEditModal = function(selectedUser) {
            $uibModal.open({
                animation: true,
                templateUrl: 'templates/profile_edit_modal.html',
                controller: function($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    $scope.selectedUser = selectedUser;
                    // azioni possibili all'interno della modale
                    $scope.ok = function() {
                        $scope.loading = true

                        User.update(selectedUser,
                            function(response) {
                                //do what you need here
                                $scope.loading = false;
                                $uibModalInstance.dismiss('cancel');
                                
                            }, function(response) {
                                // errore
                                $scope.loading = false;
                            });
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'md'
            });
        };

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

                // salvo la vecchia immagine
                $scope.user.oldCoverImageUrl = $scope.user.coverImageUrl;

                // setto l'immagine di copertina...
                var dataUrl = canvas.toDataURL("image/jpeg", 1);
                $scope.user.coverImageUrl = dataUrl;
                // e anche quella della sidebar
                $scope.currentUser.coverImageUrl = dataUrl;
                $scope.$apply();

                // ottengo l'immagine ridotta
                fileItem._file = reducedFile;
                fileItem.removeAfterUpload = true;
            });
        };

        coverImageUploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            toastr.success('Immagine aggiornata');
        };

        coverImageUploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
            toastr.error('Non è stato possibile caricare l\'immagine');
            // rimetto la vecchia immagine
            $scope.user.coverImageUrl = $scope.user.oldCoverImageUrl;
            $scope.currentUser.coverImageUrl = $scope.user.oldCoverImageUrl;
        };
        
        $scope.cancelCoverImage = function() {
            // rimetto la vecchia immagine
            $scope.user.coverImageUrl = $scope.user.oldCoverImageUrl;
            $scope.currentUser.coverImageUrl = $scope.user.oldCoverImageUrl;
            // svuoto la coda
            coverImageUploader.clearQueue();
        };
        
        $scope.uploadCoverImage = function() {
            // avvia l'upload
            coverImageUploader.uploadAll();
        };

        //////////////////////////////////////////////

        // Inizializzazione del controller
        var init = function() {
            // verifico se l'utente visualizzato è seguito dall'utente loggato
            User.areYouFollowing($scope.user, $scope.toggleAction());
        };

        init();

    }]);