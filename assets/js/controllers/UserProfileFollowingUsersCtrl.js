/**
 * assets/js/controllers/UserProfileFollowingUsersCtrl.js
 *
 * Copyright 2016 Mariusz Wiazowski
 *
 * Controller usato per la pagina del profile di un qualsiasi utente.
 */
angular.module('UserProfileFollowingUsersCtrl', []).controller('UserProfileFollowingUsersCtrl', [
    '$scope',
    'User',
    '$state',
    function ($scope, User, $state) {
        // Espongo gli elementi del User service
        $scope.user = User.user;//utente del profilo
        $scope.getUserProfileImage = User.getUserProfileImage;//metodo per ottenere l'immagine del profilo
        
        
        $scope.following_users = User.following_users;
        //////////////////////////////////////////////
        
        // Inizializzazione del controller
        var init = function () {
            
        }
        
        init();
        
    }]);