/**
 * assets/js/controllers/UserProfileCtrl.js
 *
 * Copyright 2016 Mariusz Wiazowski
 *
 * Controller usato per la pagina del profile di un qualsiasi utente.
 */
angular.module('UserProfileCtrl', []).controller('UserProfileCtrl', [
    '$scope',
    'User',
    '$state',
    'Recipe',
    function ($scope, User, $state, Recipe) {
        // Espongo gli elementi del User service
        $scope.user = User.user;//utente del profilo
        $scope.getUserProfileImage = User.getUserProfileImage;//metodo per ottenere l'immagine del profilo
        
        // Espongo il metodo per determinare lo stato dell'app
        $scope.getCurrentState = function () {
            return $state.current.name;
        }
        
    }]);