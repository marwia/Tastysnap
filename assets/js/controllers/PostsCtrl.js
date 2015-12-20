/**
 * assets/js/controllers/PostsCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con i post: aggiungere commenti ad essi
 * e "upvotare" questi commenti.
 */
angular.module('PostsCtrl', []).controller('PostsCtrl', [
	'$scope',
	'posts',
	'post',
	'Auth',
	function($scope, posts, post, Auth){

    // espongo allo scope il metodo di auth chiamato "isLoggedIn"
    $scope.isLoggedIn = Auth.isLoggedIn;

    $scope.post = post;

    // funzione per aggiungere un commento ad un post
    $scope.addComment = function(){
    	if($scope.body === '') { return; }
    	posts.addComment(post.id, {
    		body: $scope.body
    	}).success(function(comment) {
    		$scope.post.comments.push(comment);
    	});
    	$scope.body = '';
    };

    // funzione per incrementare i voti di un commento
    $scope.incrementUpvotes = function(comment){
    	posts.upvoteComment(post, comment);
    };

}]);