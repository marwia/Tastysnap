/**
 * assets/js/controllers/AuthCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per esporre le funzioni di servizio di autenticazione.
 * Questo espone nello scope l'oggetto user e due metodi per fare il login
 * o la registrazione.
 */
angular.module('AuthCtrl', []).controller('AuthCtrl', [
	'$scope',
	'$state',
	'Auth',
	function($scope, $state, Auth){
		$scope.user = {};

		$scope.register = function(){
			Auth.register($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('app.home.most_recent');
			});
		};

		$scope.logIn = function(){
	
			Auth.logIn($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('app.home.most_recent');
			});
			
		};
	}]);