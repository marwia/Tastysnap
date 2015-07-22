// assets/js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', [
	'$scope',
	'posts', // variabile "inniettata" dal service
	'auth',
	function($scope, posts, auth){
		$scope.test = 'Hello world!';

    	// espongo allo scope il metodo di auth chiamato "isLoggedIn"
    	$scope.isLoggedIn = auth.isLoggedIn;

		$scope.posts = posts.posts;// aggiungo i post inniettati a tutti i post

    	/*
		$scope.posts = [
		{title: 'post 1', upvotes: 5},
		{title: 'post 2', upvotes: 2},
		{title: 'post 3', upvotes: 15},
		{title: 'post 4', upvotes: 9},
		{title: 'post 5', upvotes: 4}
		];*/

		$scope.addPost = function(){
			if(!$scope.title || $scope.title === '') { return; }

			console.log(auth.currentUser());
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