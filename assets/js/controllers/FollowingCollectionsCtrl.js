/**
 * assets/js/controllers/FollowingCollectionsCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per esporre le funzioni di servizio di autenticazione.
 * Questo espone nello scope l'oggetto user e due metodi per fare il login
 * o la registrazione.
 */
angular.module('FollowingCollectionsCtrl', []).controller('FollowingCollectionsCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'Collection',
    'User',
    function($scope, $state, $stateParams, Collection, User) {
        
        // Espongo i metodi del User service
        $scope.currentUser = User.currentUser
        $scope.collections = Collection.collections;
        
        // wrapper per il pulsante "carica altro"
        $scope.getFollowingCollections = function (skip, successCB, errorCB) {
            Collection.getUserFollowingCollections(
                $scope.currentUser.id, 
                null, 
                skip, 
                successCB, 
                errorCB);

        }

        var init = function() {
            // inizializzazione del controller
            Collection.getUserFollowingCollections($scope.currentUser.id);
        };
        // and fire it after definition
        init();

    }]);