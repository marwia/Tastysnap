/**
 * assets/js/controllers/CollectionDetailCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con il dettaglio di una ricetta.
 * Attenzione: si dovrebbe usare questo controller in concomitanza del suo
 * genitore (con più alto grado di gerarchia): RecipeCtrl.
 */
angular.module('CollectionDetailCtrl', []).controller('CollectionDetailCtrl', [
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
        
        // espongo allo scope le collection del servizio Collection
        $scope.detailedCollection = Collection.detailedCollection;
        
        // espongo i metodi del servizio User
        $scope.getUserProfileImage = User.getUserProfileImage;

        $scope.formatDate = function (collection) {
            moment.locale("it");
            return moment(collection.createdAt).fromNow();
        };
        
        $scope.getCasulaCoverBlurredImage = function () {
            var idx = Math.floor(Math.random() * $scope.detailedCollection.recipes.length) + 0;
            
            return $scope.detailedCollection.recipes[idx].blurredCoverImageUrl;
        };

        var init = function () {
            // inizializzazione del controller
            Collection.getDetailedCollectionRecipes();
        };
        // and fire it after definition
        init();

    }]);