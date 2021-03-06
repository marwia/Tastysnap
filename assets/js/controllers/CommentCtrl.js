/**
 * assets/js/controllers/CommentCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per gestire i commenti a ricette.
 */
angular.module('CommentCtrl', []).controller('CommentCtrl', [
	'$scope',
	'$state',
	'User',
    'Comment',
	function($scope, $state, User, Comment){
        
        $scope.commentToCreate = {};

        // Espongo i metodi del User service
        $scope.currentUser = User.currentUser
        $scope.getUserProfileImage = User.getUserProfileImage;
        
        // Espongo i metodi del Comment service
        $scope.checkVote = Comment.checkVote;
        $scope.deleteComment = Comment.delete;
        $scope.getRecipeComments = function (skip, successCB, errorCB) {
            Comment.getRecipeComments($scope.detailedRecipe, 5, skip, successCB, errorCB);
        }
        
        $scope.toggleUpvote = function(comment, vote) {
            if (comment.userUpvote != null) {
                Comment.deleteVote(comment, vote);
            }
            else {
                Comment.upvote(comment);
            }
        };
        
        $scope.toggleDownvote = function(comment, vote) {
            if (comment.userDownvote != null) {
                Comment.deleteVote(comment, vote);
            }
            else {
                Comment.downvote(comment);
            }
        };
        
        // Espongo i metodi del Comment service
        $scope.create = function () {
            Comment.create($scope.detailedRecipe, $scope.commentToCreate, function success(response) {
                $scope.commentToCreate.body = "";
            })
        };
        
        var init = function () {
            // inizializzazione del controller
            Comment.getRecipeComments($scope.detailedRecipe, 5, 0);
        };
        // and fire it after definition
        init();
		
	}]);