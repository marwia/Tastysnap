/**
 * assets/js/controllers/NavCtrl.js
 *
 * Copyright 2015 Mariusz Wiazowski
 *
 * Controller usato per la navbar, serve a esporre le funzioni
 * e gli oggetti del servizio per l'autenticazione durante
 * la gestione della navbar.
 */
angular.module('SideBarCtrl', []).controller('SideBarCtrl', [
    '$scope',
    'Auth',
    'User',
    '$http',
    '$state',
    function ($scope, Auth, User, $http, $state) {
        // Espongo i metodi del Auth service
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.logOut = Auth.logOut;
    
        // Espongo i metodi del User service
        $scope.currentUser = User.currentUser
        
        // Espongo il metodo per determinare lo stato dell'app
        $scope.getCurrentState = function () {
            return $state.current.name;
        };
    
    }]);