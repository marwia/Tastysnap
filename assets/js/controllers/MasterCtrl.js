/**
 * assets/js/controllers/alert-ctrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller offerto insieme al progetto su Github: https://github.com/rdash/rdash-angular
 * Serve principalmente per gestire la sidebar (chiusura e apertura).
 */
angular.module('MasterCtrl', []).controller('MasterCtrl', [
    '$scope',
    '$cookieStore',
    'Auth', // variabile "inniettata" dal service per l'autenticazione
    function($scope, $cookieStore, Auth){
        
        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
    	$scope.isLoggedIn = Auth.isLoggedIn;
        $scope.toggle = true;
        $scope.hellow = true;

        /**
         * Setto il toggle memorizzato soltanto se l'utente risulta loggato
         */
        if ($scope.isLoggedIn() && angular.isDefined($cookieStore.get('toggle'))) {
            $scope.toggle = $cookieStore.get('toggle');

            $scope.hellow = false;
        }

        /**
         * Sidebar Toggle & Cookie Control
         */
        $scope.toggleSidebar = function() {
            $scope.toggle = !$scope.toggle;
            $cookieStore.put('toggle', $scope.toggle);
        };
        
        /**
         * Funzione per nascondere la sideBar.
         */
        $scope.hideSidebar = function() {
            $scope.toggle = false;
            $cookieStore.put('toggle', $scope.toggle);
        };

    }]);