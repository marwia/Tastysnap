/**
 * assets/js/controllers/NavCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per la navbar, serve a esporre le funzioni
 * e gli oggetti del servizio per l'autenticazione durante
 * la gestione della navbar.
 */
angular.module('NavCtrl', []).controller('NavCtrl', [
    '$scope',
    'Auth',//service
    'User',//service
    '$http',
    function ($scope, Auth, User, $http) {
        // Espongo i metodi del Auth service
        $scope.isLoggedIn = Auth.isLoggedIn;
        //$scope.currentUser = Auth.currentUser;
        $scope.logOut = Auth.logOut;
        
        // Espongo i metodi e oggetti del User service
        $scope.currentUser = User.currentUser;
        $scope.getUserProfileImage = User.getUserProfileImage;
    

    }]);