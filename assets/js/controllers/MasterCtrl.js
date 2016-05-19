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

        /**
         * Sidebar Toggle & Cookie Control
         */
        var mobileView = 768;

        $scope.getWidth = function() {
            return window.innerWidth;
        };

        $scope.$watch($scope.getWidth, function(newValue, oldValue) {
            if (newValue >= mobileView && $scope.isLoggedIn() == false) {
                if (angular.isDefined($cookieStore.get('toggle'))) {
                    $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
                } else {
                    $scope.toggle = true;
                }
            } else {
                $scope.toggle = false;
            }
        });

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

        window.onresize = function() {
            $scope.$apply();
        };
    }]);