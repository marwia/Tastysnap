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
        $scope.collections = Collection.collections;
        $scope.detailedCollection = Collection.detailedCollection;
        
        // espongo i metodi del servizio User
        $scope.getUserProfileImage = User.getUserProfileImage;
        
         /**
         * Inizializzazione di un dettaglio di una Collection.
         */
        $scope.initDetailedCollection = function (collection) {
            Collection.createView(collection);
            Collection.checkTry(collection);
        }
        
        $scope.formatDate = function (collection) {
            moment.locale("it");
            return moment(collection.createdAt).fromNow(); 
        }
        
    }]);