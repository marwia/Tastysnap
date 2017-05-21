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

            // pagination variables
            $scope.totalItems = Recipe.recipesCount;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 30;

            $scope.recipes = Recipe.recipes;

            $scope.$watch("currentPage", function (newValue, oldValue) {
                if (newValue === oldValue) {
                    console.log("called due initialization");
                } else if (newValue != oldValue) {
                    console.info("currentPage", $scope.currentPage);
                    Recipe.getRecipes(($scope.currentPage -1) * $scope.itemsPerPage, true);
                }
            }, true);

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

            $scope.openChangeIngredientStateModal = function (selectedRecipe) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'admin_assets/templates/recipe_change_ing_state_modal.html',
                    controller: function ($uibModalInstance, $scope) {
                        // passaggio paramteri
                        $scope.loading = false;
                        $scope.selectedRecipe = selectedRecipe;
                        $scope.ingredientStates = ['ok', 'toBeValidate', 'notValid']
                        // azioni possibili all'interno della modale
                        $scope.ok = function () {
                            $scope.loading = true

                            Recipe.changeIngredientState(selectedRecipe,
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
                    size: 'lg'
                });
            };

        }
    ]);