/**
 * assets/js/controllers/RecipeReviewCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per gestire le recensioni di ricette.
 */
angular.module('RecipeReviewCtrl', []).controller('RecipeReviewCtrl', [
	'$scope',
	'$state',
	'User',
    'RecipeReview',
	function($scope, $state, User, RecipeReview){
        
        $scope.commentToCreate = {};

        // Espongo i metodi del RecipeReview service
        $scope.createRecipeReview = RecipeReview.create;
        
        $scope.createRecipeReview = function (typology, value) {
            var review = {
                typology: typology,
                value: value  
            };
            RecipeReview.create($scope.detailedRecipe, review);
        }
        
        var init = function () {
            // inizializzazione del controller
            RecipeReview.getRecipeTotalValueForTypology($scope.detailedRecipe, "cost");
            RecipeReview.getRecipeTotalValueForTypology($scope.detailedRecipe, "difficulty");
            RecipeReview.getRecipeTotalValueForTypology($scope.detailedRecipe, "calories");
        };
        // and fire it after definition
        init();
		
	}]);