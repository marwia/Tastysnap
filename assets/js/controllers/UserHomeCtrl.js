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
    'Auth',
    function ($scope, User, $state, Auth) {
        
        $scope.following_users = User.following_users;
        
        // Espongo il metodo per determinare lo stato dell'app
        $scope.getCurrentState = function () {
            return $state.current.name;
        };
        
        $scope.getFollowingUsers = function (skip, successCB, errorCB) {
            User.getFollowingUsers(Auth.currentUser().id, null, skip, successCB, errorCB);
        }

    }]);