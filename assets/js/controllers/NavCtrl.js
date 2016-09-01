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
    '$stateParams',
    'Auth',//service
    'User',//service
    '$http',
    '$location',
    function ($scope, $stateParams, Auth, User, $http, $location) {
        // Espongo i metodi del Auth service
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.q = $stateParams.q;// query di ricerca
        $scope.logOut = Auth.logOut;

        /**
         * Pezzo di codice che serve ad aggiornare la query nella
         * navbar.
         */
        $scope.$on('$locationChangeSuccess', function (event) {
            $scope.q = $stateParams.q;// query di ricerca
            // azzero la query di ricerca se esco dalla pagina "ricerca"
            if ($location.path().indexOf("app/search") == -1)
                $scope.q = "";
        });
        
        // Espongo i metodi e oggetti del User service
        $scope.currentUser = User.currentUser;
        $scope.getUserProfileImage = User.getUserProfileImage;
    }]);