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
  'Auth',
  function($scope, Auth){
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.currentUser = Auth.currentUser;
    $scope.logOut = Auth.logOut;
}]);