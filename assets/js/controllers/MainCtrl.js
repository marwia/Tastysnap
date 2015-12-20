/**
 * assets/js/controllers/MainCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato principalmente per esporre le funzioni di servizio 
 * per gestire i posts.
 */
angular.module('MainCtrl', []).controller('MainCtrl', [
	'$scope',
	'posts', // variabile "inniettata" dal service dei posts
	'Auth', // variabile "inniettata" dal service per l'autenticazione
	function($scope, posts, Auth){
		$scope.test = 'Hello world!';

    	// espongo allo scope il metodo di auth chiamato "isLoggedIn"
    	$scope.isLoggedIn = Auth.isLoggedIn;

		$scope.posts = posts.posts;// aggiungo i post inniettati a tutti i post



		$scope.addPost = function(){
			if(!$scope.title || $scope.title === '') { return; }

			console.log(Auth.currentUser());
			posts.create({
				title: $scope.title,
				link: $scope.link
			});
			$scope.title = '';
			$scope.link = '';
		};

		$scope.incrementUpvotes = function(post) {
			posts.upvote(post);
		};
	}]);