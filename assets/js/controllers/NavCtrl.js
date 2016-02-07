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
        
        // Espongo i metodi del User service
        $scope.currentUser = User.currentUser;
    
        // Any function returning a promise object can be used to load values asynchronously
        /**
         * Funzione che serve per eseguire una ricerca istantanea delle ricette.
         */
        $scope.getLocation = function (val) {
            return $http.get('/api/v1/recipe', {
                params: {
                    where: {
                        "title": { "contains": val }
                    }
                }
            }).then(function (response) {
                return response.data;
            });
        };

    }]);