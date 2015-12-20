/**
 * assets/js/controllers/RecipeCreateCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per la creazione di una ricetta.
 */
angular.module('RecipeCreateCtrl', []).controller('RecipeCreateCtrl', [
	'$scope', // lo scope
	'$state', // gestione degli stati dell'app (ui-router)
	'Recipe', // servizio per le ricette
	'Auth', // servizio per l'autenticazione
	function($scope, $state, Recipe, Auth){

		// espongo allo scope il metodo di auth chiamato "isLoggedIn"
		$scope.isLoggedIn = Auth.isLoggedIn;
		
		// espongo le categorie delle ricette estraendole dal servizio
		// il caricamento della categorie viene eseguito ad ogni
		// ingresso nello stato in cui si crea una ricetta
		$scope.recipeCategories = Recipe.recipeCategories;
		$scope.selected_category = $scope.recipeCategories[0];
		$scope.dosageTypes = Recipe.dosagesTypes;
		$scope.selected_dosage_type = $scope.dosageTypes[0];
		
		$scope.dosagesFor;
		$scope.desscription;
		
		// TODO: bisogna memorizzare degli oggetti più complessi...
		$scope.ingredient_groups = 
			[{
				id: "0",
			 	title: "",
				ingredients: [{
      				name: "",
      				quantity: "",
      				type: ""
    			}]
			}];
		
		// metodo per aggiungere banalmente un gruppo di ingredienti
		$scope.addIngredientGroup = function(index){
			$scope.ingredient_groups
				.push({
				id: "0",
			 	title: "",
				ingredients: [{
      				name: "",
      				quantity: "",
      				type: ""
    			}]
			});
		};
		
		$scope.addIngredient = function(index) {
			$scope.ingredient_groups[index].ingredients.push({
      				name: "",
      				quantity: "",
      				type: ""
    			});
		};
		
		$scope.removeIngredientGroup = function(index){
			$scope.ingredient_groups.splice(index, 1);
		};
		
		$scope.addRecipe = function(){
			var recipeToCreate = {
				title: $scope.title,
				dosagesFor: $scope.dosagesFor,
				dosagesType: $scope.selected_dosage_type,
				category: $scope.selected_category,
				description: $scope.description
			};
			console.log(recipeToCreate);
			
			Recipe.create(recipeToCreate,
				function(response) {
					$state.go('dashboard');
			});
    	};


}]);