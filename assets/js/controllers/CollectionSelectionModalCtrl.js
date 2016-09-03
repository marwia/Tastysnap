/**
 * assets/js/controllers/CollectionSelectionModalCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller per la modale che permette l'aggiunta di una ricetta ad una raccolta.
 * Oltre a questo, il seguente controller gestisce sia la creazione di una nuova
 * raccolta sia la ricerca tra le raccolte dell'utente loggato.
 */
angular.module('CollectionSelectionModalCtrl', [])
    .controller('CollectionSelectionModalCtrl',
    function ($scope, $uibModalInstance, selectedRecipe, Collection, $uibModal, toastr) {

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        // cose aggiunte
        $scope.selectedRecipe = selectedRecipe;

        $scope.collections = Collection.userCollections;

        /**
         * Funzione per aggiungere una ricetta ad una raccolta esistente
         */
        $scope.addRecipeToCollection = function (collection) {
            Collection.addRecipeToCollection($scope.selectedRecipe,
                collection, function success(response) {
                    // close modal
                    $uibModalInstance.close();
                })
        }

        /**
        * Modale per creare una nuova raccolta
        */

        $scope.openCreateCollectionModal = function () {
            var selectedRecipe = $scope.selectedRecipe;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/collection_create_modal.html',
                controller: function ($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    // creazione di una nuova collection
                    $scope.collection = {
                        title: "",
                        description: "",
                        isPrivate: false
                    };

                    // azioni possibili all'interno della modale

                    // crea
                    $scope.ok = function () {
                        $scope.loading = true;

                        Collection.create($scope.collection,
                            function (response) {

                                // aggiungo la ricetta alla nuova raccolta
                                Collection.addRecipeToCollection(
                                    selectedRecipe,
                                    response.data,
                                    function success(response) {
                                        //do what you need here
                                        $scope.loading = false;
                                        // close modal
                                        $uibModalInstance.close(response.data);
                                    },
                                    function (response) {
                                        $scope.loading = false;
                                    });

                            }, function (response) {
                                // errore
                                $scope.loading = false;
                            });
                    };

                    // annulla
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                },
                size: 'lg'
            });

            // aggiorno i risultati
            modalInstance.result.then(function (collection) {
                toastr.success('Raccolta creata e ricetta aggiunta');
                // aggiungo subito la nuova raccolta
                Collection.userCollections.push(collection);
                Collection.collections.push(collection);
                // la raccolta è stata creata e la ricetta è stata aggiunta
                $uibModalInstance.close();
            });

        };

    });