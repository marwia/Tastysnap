/**
 * assets/js/controllers/CollectionSelectionModalCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller per la modale che permette l'aggiunta di una ricetta ad una raccolta.
 * Oltre a questo, il seguente controller gestisce sia la creazione di una nuova
 * raccolta sia la ricerca tra le raccolte dell'utente loggato.
 */
angular.module('CollectionEditModalCtrl', [])
    .controller('CollectionEditModalCtrl',
    function ($scope, $uibModalInstance, selectedCollection, Collection, $uibModal, toastr, Auth, ImageUtils, FileUploader, $http, $state) {
        // passaggio paramteri
        $scope.loading = false;//serve per garantire una migliore esperienza utente
        $scope.collection = angular.copy(selectedCollection);
        $scope.updateProgress = 0;
        $scope.updateProgressSum = 0;
        $scope.uploadedCoverImageUrl = null;

        // File uploading (configuration)
        var coverImageUploader = $scope.coverImageUploader = new FileUploader({
            alias: 'image',
            method: 'put',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
                'x-csrf-token': $http.defaults.headers.common['x-csrf-token']
            }
        });
        // FILTERS
        var coverImageFilter = {
            name: 'coverImageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';

                return '|jpg|png|jpeg|'.indexOf(type) !== -1 // filter file type
                    && this.queue.length < 1; // max 1 image
            }
        }
        // Set filters
        coverImageUploader.filters.push(coverImageFilter);
        // ImageUploader Callbacks
        coverImageUploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);

            ImageUtils.reduceImageSizeAndQuality(fileItem._file, 1024, 1024, 0.7, function (canvas, reducedFile) {
                // ottengo l'immagine ridotta
                fileItem._file = reducedFile;
                // setto l'immagine di copertina...
                var dataUrl = canvas.toDataURL("image/jpeg", 1);
                $scope.uploadedCoverImageUrl = dataUrl;
            });
        };
        coverImageUploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
            // aggiorno dinamicamente l'url per l'upload
            item.url = '/api/v1/collection/' + $scope.collection.id + '/upload_cover_image';
        };
        coverImageUploader.onCompleteItem = function (fileItem, response, status, headers) {
            $scope.updateProgress++;
            //$scope.uploadedCoverImageUrl = response.coverImageUrl;
        };

        // azioni possibili all'interno della modale

        // salva
        $scope.ok = function () {
            $scope.loading = true;

            // calcolo delle operazioni attese (update + eventuale immagine)
            $scope.updateProgressSum = 1 + coverImageUploader.queue.length;

            // se la raccolta aveva una immagine di copertina 
            // e ora non la ha allora la devo cancellare 
            // (e non ho intenzione di caricarne una nuova)
            if ($scope.collection.coverImageUrl == null
                && selectedCollection['coverImageUrl'] != null
                && coverImageUploader.queue.length == 0){

                $scope.updateProgressSum++;// aggiungo l'eliminazione dell'immagine
                Collection.deleteCoverImage($scope.collection.id, function (response) {
                    $scope.updateProgress++;
                    console.log("faccio una delete");
                });
            }

            // carico l'immagine di copertina 
            coverImageUploader.uploadAll();

            Collection.update($scope.collection,
                function (response) {
                    //do what you need here
                    $scope.updateProgress++;
                }, function (response) {
                    // errore
                });
        };

        /**
         * Osserva la variabile che indica il updateProgresso della creazione della ricetta.
         */
        $scope.$watch("updateProgress", function (newValue, oldValue) {

            if (newValue != oldValue && $scope.updateProgress >= $scope.updateProgressSum) {// fine della creazione della ricetta
                // Attendo 0.5 secondi prima di chiudere la modale
                setTimeout(function () {
                    $scope.loading = false;
                     // aggiorno le modifiche e chiudo
                    $scope.collection.coverImageUrl = $scope.uploadedCoverImageUrl;
                    $uibModalInstance.close($scope.collection);
                }, 500);
            }
        });

        // annulla
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        // elimina raccolta
        $scope.delete = function () {
            var eliminationModalInstance = $scope.openEliminationModal();

            // attendo la conferma dell'eliminazione
            eliminationModalInstance.result.then(function (result) {
                toastr.success('Raccolta eliminata');

                // chiudo la modale corrente
                $uibModalInstance.dismiss('cancel');
                // cambio stato
                $state.go('app.home.most_recent');
            });
        }

        /**
         * Modale per eliminare una raccolta
         */

        $scope.openEliminationModal = function () {
            var collection = $scope.collection;
            return $uibModal.open({
                animation: true,
                templateUrl: 'templates/collection_elimination_modal.html',
                controller: function ($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    $scope.collection = collection;
                    // azioni possibili all'interno della modale
                    $scope.ok = function () {
                        $scope.loading = true;

                        Collection.delete($scope.collection.id,
                            function (response) {
                                //do what you need here
                                $scope.loading = false;
                                $uibModalInstance.close(true);

                            }, function (response) {
                                // errore
                                $scope.loading = false;
                            });
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'sm'
            });
        };

    });