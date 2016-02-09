/**
 * assets/js/controllers/RecipeCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con le ricette.
 */
angular.module('RecipeCtrl', []).controller('RecipeCtrl', [
	'$scope',
	'Recipe',
	'Auth',
	function($scope, Recipe, Auth){

    // espongo allo scope il metodo di auth chiamato "isLoggedIn"
    $scope.isLoggedIn = Auth.isLoggedIn;
	
    // espongo allo scope le ricette del servizio Recipe
	$scope.recipes = Recipe.recipes;
    $scope.detailedRecipe = Recipe.detailedRecipe;


}]);