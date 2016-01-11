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
  '$http',
  function($scope, Auth, $http){
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.currentUser = Auth.currentUser;
    $scope.logOut = Auth.logOut;
    
    // Any function returning a promise object can be used to load values asynchronously
    $scope.getLocation = function(val) {
        return $http.get('/api/v1/recipe', {
        params: {
            where: {
                "title": {"contains": val}
                }
        }
        }).then(function(response){
            return response.data;
        });
    };
  
}]);