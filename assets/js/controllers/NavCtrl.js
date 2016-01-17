/**
 * assets/js/controllers/NavCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per la navbar, serve a esporre le funzioni
 * e gli oggetti del servizio per l'autenticazione durante
 * la gestione della navbar.
 */
angular.module('SideBarCtrl', []).controller('SideBarCtrl', [
  '$scope',
  'Auth',
  '$http',
  function($scope, Auth, $http){
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.currentUser = Auth.currentUser;
    $scope.logOut = Auth.logOut;
    
  
}]);