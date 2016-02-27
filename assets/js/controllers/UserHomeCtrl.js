/**
 * assets/js/controllers/UserHomeCtrl.js
 *
 * Copyright 2016 Mariusz Wiazowski
 *
 * Controller usato per la pagina della home di un qualsiasi utente.
 */
angular.module('UserHomeCtrl', []).controller('UserHomeCtrl', [
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
        
        // espongo allo scope le ricette del servizio Recipe
        $scope.recipes = Recipe.recipes;
    }]);