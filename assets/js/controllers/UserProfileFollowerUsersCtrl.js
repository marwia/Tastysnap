/**
 * assets/js/controllers/UserProfileFollowerUsersCtrl.js
 *
 * Copyright 2016 Mariusz Wiazowski
 *
 * Controller usato per la pagina del profile di un qualsiasi utente.
 */
angular.module('UserProfileFollowerUsersCtrl', []).controller('UserProfileFollowerUsersCtrl', [
    '$scope',
    'User',
    '$state',
    function ($scope, User, $state) {
        // Espongo gli elementi del User service
        $scope.user = User.user;//utente del profilo
        $scope.getUserProfileImage = User.getUserProfileImage;//metodo per ottenere l'immagine del profilo
        
        
        $scope.follower_users = User.follower_users;
        //////////////////////////////////////////////
        
        // Inizializzazione del controller
        var init = function () {
            
        }
        
        init();
        
    }]);