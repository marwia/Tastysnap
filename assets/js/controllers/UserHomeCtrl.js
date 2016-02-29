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
        
        // Espongo il metodo per determinare lo stato dell'app
        $scope.getCurrentState = function () {
            return $state.current.name;
        }

    }]);