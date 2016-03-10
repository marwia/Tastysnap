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
        $scope.create = function () {
            Comment.create($scope.detailedRecipe, $scope.commentToCreate, function success(response) {
                $scope.commentToCreate.body = "";
            })
        }
        
        var init = function () {
            // inizializzazione del controller
            Comment.getRecipeComments($scope.detailedRecipe);
        };
        // and fire it after definition
        init();
		
	}]);