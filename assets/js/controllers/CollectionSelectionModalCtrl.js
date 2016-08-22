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
        function ($scope, $uibModalInstance, selectedRecipe, Collection) {

            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
    
            // cose aggiunte
            $scope.selectedRecipe = selectedRecipe;

            $scope.collections = Collection.userCollections;
            
            // creazione di una nuova collection
            $scope.collectionToCreate = {
                title: "",
                description: "",
                isPrivate: false
            };
            
            $scope.addRecipeToCollection = function (collection) {
                Collection.addRecipeToCollection($scope.selectedRecipe,
                collection, function success(response) {
                    // close modal
                    $uibModalInstance.close();
                })
            }
            
            /**
             * Metodo per creare una collection nuova.
             */
            $scope.createCollection = function () {
                Collection.create($scope.collectionToCreate, function (response) {
                    
                    $scope.collectionToCreate = response.data
                    $scope.collections.push($scope.collectionToCreate);

                    //visualizzo tutte le raccolte, in alternativa si puo chiudere la modal e inviare una notifica
                    $scope.showme = false;

                    //inizializzo le variabili
                    $scope.title = "";
                    $scope.description= "";
                })
            }
        });