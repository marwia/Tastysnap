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
	'$stateParams',
	function($scope, $state, Auth, $stateParams){
		$scope.user = {};
		$scope.invitation_id = $stateParams.invitation_id;// invito per l'iscrizione (opzionale)

		$scope.error = $stateParams.error;// errore presente nell'url ritornata dal server

		/**
		 * Eseguo il controllo se il sistema
		 * ad inviti è attivo.
		 * Cosi posso mostrare un messaggio di errore 
		 * se l'utente non possiede un invito prima di fare
		 * l'eventuale tentativo a vuoto.
		 */
		/*
		Auth.isInvitationRequired(function(data) {
			console.info("data: ", data);
			if(data.on == true && 
				$scope.error == undefined && 
				$scope.invitation_id == undefined){//sistema ad inviti attivo
				$scope.error=2;
			}
		})*/
		
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