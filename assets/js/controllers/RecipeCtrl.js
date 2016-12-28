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

        $scope.openCollectionSelectionModal = function (selectedRecipe) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/recipe_collection_selection_modal.html',
                controller: 'CollectionSelectionModalCtrl',
                // classe aggiuntiva a modal-dialog (ci imposto la dmensione) modal-add-recipe-to-collection
                size: 'add-recipe-to-collection',
                resolve: {
                    // passaggio di paramteri
                    selectedRecipe: selectedRecipe,
                    collections: function () {
                        console.log("chiamata selection modal, id utente: " + Auth.currentUser().id);
                        return Collection.getUserCollections(
                            Auth.currentUser().id,
                            null,
                            function errorCB(response) {
                                // in caso di assenza di raccolte del corrente utente devo svuotare l'array
                                Collection.collections = [];
                            });
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
                        // to do
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
            Recipe.getAll("createdAt DESC", skip, successCB, errorCB);
        };

        // le più assaggiate
        $scope.getMostTasted = function (skip, successCB, errorCB) {
            Recipe.getAll("trialsCount DESC", skip, successCB, errorCB);
        };

    }]);