// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

/**
 * assets/js/controllers/CollectionSelectionModalCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller per la modale che permette l'aggiunta di una ricetta ad una raccolta.
 */
angular.module('CollectionSelectionModalCtrl', [])
    .controller('CollectionSelectionModalCtrl',
        function ($scope, $uibModalInstance, items, selectedRecipe, Collection) {


            $scope.items = items;
            $scope.selected = {
                item: $scope.items[0]
            };

            $scope.ok = function () {
                $uibModalInstance.close($scope.selected.item);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
    
            // cose aggiunte
            $scope.selectedRecipe = selectedRecipe;

            $scope.collections = Collection.collections;
            
            // creazione di una nuova collection
            $scope.collectionToCreate = {
                title: "",
                description: "",
                isPrivate: false
            };
            
            $scope.createCollection = function () {
                Collection.create($scope.collectionToCreate, function (response) {
                    
                    $scope.collectionToCreate = response.data
                    $scope.collections.push($scope.collectionToCreate);
                })
            }
        });