/**
 * assets/js/controllers/AuthCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per esporre le funzioni di servizio di autenticazione.
 * Questo espone nello scope l'oggetto user e due metodi per fare il login
 * o la registrazione.
 */
angular.module('SearchCtrl', []).controller('SearchCtrl', [
	'$scope',
	'$state',
    '$stateParams',
	function($scope, $state, $stateParams){
		
        $scope.q = $stateParams.q;
        
	}]);