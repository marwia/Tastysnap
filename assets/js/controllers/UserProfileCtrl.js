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
        
        $scope.action = "SEGUI";
        // Espongo il metodo per determinare lo stato dell'app
        $scope.getCurrentState = function () {
            return $state.current.name;
        }
        
        $scope.toggleFollow = function (user) {
            if (user.isFollowed == true) {
                User.unfollowUser(user, function () {
                    //fatto
                })
            } else {
                User.followUser(user, function () {
                    //fatto
                })
            }
        }
        
        $scope.onMouseEnter = function () {
            if ($scope.user.isFollowed == true) {
                $scope.action = "SMETTI DI SEGUIRE";
            }
        }
        
        $scope.toggleAction = function () {
            $scope.action = "";
        }
        
        
        // Inizializzazione del controller
        var init = function () {
            // verifico se l'utente visualizzato è seguito dall'utente loggato
            User.areYouFollowing($scope.user, $scope.toggleAction());
        }
        
        init();
        
    }]);