/**
 * assets/js/controllers/RecipeDetailCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con il dettaglio di una ricetta.
 * Attenzione: si dovrebbe usare questo controller in concomitanza del suo
 * genitore (con più alto grado di gerarchia): RecipeCtrl.
 */
angular.module('RecipeDetailCtrl', []).controller('RecipeDetailCtrl', [
    '$scope',
    'Recipe',
    'Ingredient',
    'Auth',
    'Collection',
    '$uibModal',
    '$log',
    '$state', // gestione degli stati dell'app (ui-router)
    'User',
    function($scope, Recipe, Ingredient, Auth, Collection, $uibModal, $log, $state, User) {

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;

        // espongo allo scope le ricette del servizio Recipe
        $scope.detailedRecipe = Recipe.detailedRecipe;
        $scope.isRecipeAuthor = Recipe.isRecipeAuthor;

        // espongo i metodi del servizio User
        $scope.getUserProfileImage = User.getUserProfileImage;

        /**
        * Inizializzazione di un dettaglio di una ricetta.
        */
        $scope.initDetailedRecipe = function(recipe) {
            Recipe.createView(recipe);
            Recipe.checkTry(recipe);
            Ingredient.getIngredientGroupIngredients(recipe.ingredientGroups[0]);
        }

        $scope.deleteCurrentRecipe = function() {
            Recipe.delete($scope.detailedRecipe.id,
                function(response) {
                    $state.go('app');
                }, function(response) {
                    // errore
                });
        };

        $scope.toggleTryRecipe = function(recipe) {
            if (recipe.userTry) {
                Recipe.deleteTry(recipe);
            } else {
                Recipe.createTry(recipe);
            }

        };

        // MODALE PER CONFERMARE L'ELIMINAZIONE DI UNA RICETTA

        $scope.openEliminationModal = function(selectedRecipe) {
            $uibModal.open({
                animation: true,
                templateUrl: 'templates/recipe_elimination_modal.html',
                controller: function($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    $scope.selectedRecipe = selectedRecipe;
                    // azioni possibili all'interno della modale
                    $scope.ok = function() {
                        $scope.loading = true

                        Recipe.delete(selectedRecipe.id,
                            function(response) {
                                //do what you need here
                                $scope.loading = false;
                                $uibModalInstance.dismiss('cancel');
                                $state.go('app.home');

                            }, function(response) {
                                // errore
                                $scope.loading = false;
                            });
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'sm'
            });
        };

        $scope.formatDate = function(recipe) {
            moment.locale("it");
            return moment(recipe.createdAt).fromNow();
        }

        $scope.calculateNutrientValues = function(recipe) {
            // calcolo totale kcal
            recipe.totalEnergy = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '208');
            
            recipe.totalProtein = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '203');
            
            recipe.totalCarbs = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '205');
            
            recipe.totalFat = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '204');
            
            recipe.totalWater = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '255');
            
            recipe.totalFibers = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '291');
            
            recipe.totalCalcium = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '301');
            
            recipe.totalIron = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '303');
            
            recipe.totalMag = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '304');
            
            recipe.totalPot = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '306');
            
            recipe.totalSod = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '307');

        }

    }]);