/**
 * assets/js/controllers/RecipeCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con le ricette.
 */
angular.module('RecipeCtrl', []).controller('RecipeCtrl', [
	'$scope',
	'recipes',
	'auth',
	function($scope, recipes, auth){

    // espongo allo scope il metodo di auth chiamato "isLoggedIn"
    $scope.isLoggedIn = auth.isLoggedIn;
	
	$scope.recipes = recipes.recipes;


}]);