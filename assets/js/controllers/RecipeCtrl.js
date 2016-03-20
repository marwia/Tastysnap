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
    'Collection',
    '$uibModal',
    '$log',
    '$state', // gestione degli stati dell'app (ui-router)
    'User',
    function ($scope, Recipe, Auth, Collection, $uibModal, $log, $state, User) {

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;
	
        // espongo allo scope le ricette del servizio Recipe
        $scope.detailedRecipe = Recipe.detailedRecipe;
        $scope.recipes = Recipe.recipes;
        
        $scope.getTextColor = Recipe.getTextColor;
        $scope.checkTry = Recipe.checkTry;
        $scope.viewRecipe = Recipe.createView;      
        $scope.checkVote = Recipe.checkVote;
        
        // espongo i metodi del servizio User
        $scope.getUserProfileImage = User.getUserProfileImage;
        
        /**
         * Verifica se l'utente loggatto attualmente è l'autore della ricetta.
         */
        $scope.isRecipeAuthor = Recipe.isRecipeAuthor;
             
        $scope.toggleUpvoteRecipe = function (recipe) {
            if (recipe.userVote == 1) {
                Recipe.deleteVote(recipe);
            } else {
                Recipe.upvote(recipe);
            }
            
        };

        $scope.openCollectionSelectionModal = function (selectedRecipe) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/recipe_collection_selection_modal.html',
                controller: 'CollectionSelectionModalCtrl',
                // classe aggiuntiva a modal-dialog (ci imposto la dmensione) modal-add-recipe-to-collection
                size: 'add-recipe-to-collection',
                resolve: {
                    selectedRecipe: selectedRecipe,
                    collections: function () {
                        return Collection.getUserCollections(Auth.currentUser.id);
                    }
                }
            });

            modalInstance.result.then(function () {
                $log.info('Modal dismissed with success at: ' + new Date());
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        
        // MODALE PER GESTIRE LA CONDIVISIONE DI UNA RICETTA
        
        $scope.openShareModal = function (selectedRecipe) {
            $uibModal.open({
                animation: true,
                templateUrl: 'templates/recipe_share_modal.html',
                controller: function ($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    $scope.selectedRecipe = selectedRecipe;
                    // azioni possibili all'interno della modale
                    $scope.ok = function () {
                        // todo
                        
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.cancel = function () {
                        // to do
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: ''
            });
        };
        
        // gestione paging
        // le più recenti
        $scope.getAll = function (skip, successCB, errorCB) {
            Recipe.getAll(null, skip, successCB, errorCB);
        };
        
        // le più assaggiate
        $scope.getMostTasted = function (skip, successCB, errorCB) {
            Recipe.getAll("trialsCount DESC", skip, successCB, errorCB);
        };
        
        /*
        $scope.skipValue = 0;
        $scope.isLoading = false;
        
        $scope.loadMore = function () {
            $scope.skipValue += 30;
            $scope.isLoading = true;
            Recipe.getAll($scope.skipValue,
                function (response) {
                    $scope.isLoading = false;
            });
        }
        
        $scope.hasMoreElements = function () {
            return $scope.recipes.length % 30 == 0;
        }
        */
        
    }]);