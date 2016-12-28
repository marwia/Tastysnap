/**
 * assets/admin_assets/js/controllers/RecipeMngmntCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con le collection.
 */
angular.module('RecipeMngmntCtrl', [])
    .controller('RecipeMngmntCtrl', [
        '$scope',
        'Recipe',
        '$uibModal',
        function ($scope, Recipe, $uibModal) {

            $scope.recipes = Recipe.recipes;

            $scope.openEliminationModal = function (selectedRecipe) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/recipe_elimination_modal.html',
                    controller: function ($uibModalInstance, $scope) {
                        // passaggio paramteri
                        $scope.loading = false;
                        $scope.selectedRecipe = selectedRecipe;
                        // azioni possibili all'interno della modale
                        $scope.ok = function () {
                            $scope.loading = true

                            Recipe.delete(selectedRecipe.id,
                                function (response) {
                                    //do what you need here
                                    $scope.loading = false;
                                    $uibModalInstance.dismiss('cancel');

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

        }
    ]);