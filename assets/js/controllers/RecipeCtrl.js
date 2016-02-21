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
    'User',
    function ($scope, Recipe, Auth, $uibModal, $log, $state, User) {

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;
	
        // espongo allo scope le ricette del servizio Recipe
        $scope.recipes = Recipe.recipes;
        $scope.detailedRecipe = Recipe.detailedRecipe;
        
        // espongo i metodi del servizio User
        $scope.getUserProfileImage = User.getUserProfileImage;
        
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

        $scope.open = function (selectedRecipe) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/my_modal.html',
                controller: 'ModalInstanceCtrl',
                // classe aggiuntiva a modal-dialog (ci imposto la dmensione) modal-add-recipe-to-collection
                size: 'add-recipe-to-collection',
                resolve: {
                    items: function () {
                        return $scope.items;
                    },
                    selectedRecipe: selectedRecipe
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        
        // MODALE PER CONFERMARE L'ELIMINAZIONE DI UNA RICETTA
        
        $scope.openEliminationModal = function (selectedRecipe) {
            $uibModal.open({
                animation: true,
                templateUrl: 'templates/recipe_elimination_modal.html',
                controller: function ($uibModalInstance, $scope) {
                    $scope.loading = false;
                    console.log("loading", $scope.loading);
                    $scope.ok = function () {
                        $scope.loading = true
                        Recipe.delete(selectedRecipe.id,
                            function (response) {
                                setTimeout(function () {
                                    //do what you need here
                                    $scope.loading = false;
                                    $uibModalInstance.dismiss('cancel');
                                    $state.go('dashboard');
                                }, 2000);
                                
                            }, function (response) {
                                // errore
                                $scope.loading = false;
                            });
                        //$uibModalInstance.dismiss('cancel');
                    };
                },
                size: ''
            });
        };


    }]);