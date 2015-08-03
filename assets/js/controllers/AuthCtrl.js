// assets/js/controllers/AuthCtrl.js
angular.module('AuthCtrl', []).controller('AuthCtrl', [
	'$scope',
	'$state',
	'auth',
	function($scope, $state, auth){
		$scope.user = {};

		$scope.register = function(){
			auth.register($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('dashboard');
			});
		};

		$scope.logIn = function(){
	
			auth.logIn($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('dashboard');
			});
			
		};
	}]);