/**
 * assets/js/controllers/RecipeCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con le ricette.
 */
angular.module('RecipeCtrl', []).controller('RecipeCtrl', [
    '$scope',
    'Recipe',
    'Auth',
    '$uibModal',
    '$log',
    '$state', // gestione degli stati dell'app (ui-router)
    function ($scope, Recipe, Auth, $uibModal, $log, $state) {

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;
	
        // espongo allo scope le ricette del servizio Recipe
        $scope.recipes = Recipe.recipes;
        $scope.detailedRecipe = Recipe.detailedRecipe;
        
        /**
         * Verifica se l'utente loggatto attualmente è l'autore della ricetta.
         */
        $scope.isRecipeAuthor = function (recipe) {
            if (Auth.isLoggedIn) {
                if (Auth.currentUser().id == recipe.author.id) {
                    return true;
                }
            }
            return false;
        }
        
        $scope.deleteCurrentRecipe = function () {
            console.log("elimino la ricetta");
            Recipe.delete($scope.detailedRecipe.id, 
            function (response) {
                $state.go('dashboard');
            }, function (response) {
                // errore
            });
        }
    
        // materiale per la modale...
        $scope.items = ['item1', 'item2', 'item3'];

        $scope.animationsEnabled = true;

        $scope.open = function (selectedRecipe) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'templates/my_modal.html',
                controller: 'ModalInstanceCtrl',
                //size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    },
                    selectedRecipe: function () {
                        return selectedRecipe;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }]);