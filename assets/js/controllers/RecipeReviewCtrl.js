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
        
        // user rating
        $scope.difficultyRating = 0;
        $scope.costRating = 0;
        $scope.caloriesRating = 0;
        
        // rating settings
        $scope.rate = 0;
        $scope.max = 5;
        $scope.isReadonly = false;
        $scope.difficultyTitles = ['molto difficile', 'difficile', 'normale', 'facile', 'molto facile']
        $scope.costTitles = ['molto costosa', 'costosa', 'normale', 'economica', 'molto economica']
        $scope.caloriesTitles = ['molto calorica', 'calorica', 'normale', 'leggera', 'molto leggera']

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };
        
        /**
         * Funzione per calcolare il valore medio 
         * di una proprietà.
         */
        $scope.getAverageValue = function (property) {
            var avg = 0;
            if ($scope.detailedRecipe[property]) {
                if ($scope.detailedRecipe[property].total != 0 && $scope.detailedRecipe[property].reviewsCount != 0) {
                    avg = $scope.detailedRecipe[property].total / $scope.detailedRecipe[property].reviewsCount;   
                }
            }
            return avg;
        };
        
        /**
         * Funzione che resitiuisce una stringa che rappresenta il
         * valore medio arrotondato.
         */
        $scope.getStringAverageValue = function (property, titlesArray) {
            var avg = $scope.getAverageValue(property);
            avg = Math.round(avg);
            
            if (avg < 1) 
                return "Nessuna recensione";
            
            return $scope[titlesArray][avg-1];
        };
        
        $scope.getStringReviewsCount = function (property) {
            if ($scope.detailedRecipe[property]) {
                if ($scope.detailedRecipe[property].reviewsCount > 1) {
                    return $scope.detailedRecipe[property].reviewsCount + " recensioni";
                } else if ($scope.detailedRecipe[property].reviewsCount > 0) {
                    return $scope.detailedRecipe[property].reviewsCount + " recensione";
                }
            }
            return "Nessuna recensione";
        }
        
        /**
         * Osserva la variabile che indica un giudizio
         * dell'utente
         */
        /*
        $scope.$watch("difficultyRating", function(newValue, oldValue) {
            console.info(newValue, " - ", oldValue);

            if (oldValue && newValue) {
            if (newValue > 0 && oldValue == 0) {// create
                $scope.createRecipeReview("difficulty", newValue);
                console.log("creo");
            } else if (newValue > 0) {// update
                console.log("update");
            } else {// delete
                RecipeReview.delete($scope.detailedRecipe, $scope.detailedRecipe.user["difficulty"]);
                console.log("delte");
            }
            }
        });*/

        
        $scope.toggleRecipeReview = function (typology, value) {
            // preparo l'eventuale voto da inviare al server
            var review = {
                typology: typology,
                value: value  
            };
            if ($scope.detailedRecipe.user && $scope.detailedRecipe.user[typology]) {
                if (value == 0) {//delete
                    RecipeReview.delete($scope.detailedRecipe, $scope.detailedRecipe.user[typology]);
                } else {// update
                    RecipeReview.update($scope.detailedRecipe, $scope.detailedRecipe.user[typology], review);
                }
            } else {// create
                RecipeReview.create($scope.detailedRecipe, review);
            }
        };
        
        var init = function () {
            // inizializzazione del controller
            RecipeReview.getRecipeTotalValueForTypology($scope.detailedRecipe, "cost");
            RecipeReview.getRecipeTotalValueForTypology($scope.detailedRecipe, "difficulty");
            RecipeReview.getRecipeTotalValueForTypology($scope.detailedRecipe, "calories");
            
            // verifico se l'utente loggato ha espresso qualche voto in merito alla ricetta
            RecipeReview.checkReview($scope.detailedRecipe, function succesCB(response) {
                if ($scope.detailedRecipe.user['difficulty'])
                    $scope.difficultyRating = $scope.detailedRecipe.user['difficulty'].value;
                if ($scope.detailedRecipe.user['cost'])
                    $scope.costRating = $scope.detailedRecipe.user['cost'].value;
                if ($scope.detailedRecipe.user['calories'])
                    $scope.caloriesRating = $scope.detailedRecipe.user['calories'].value;
            });
        };
        // and fire it after definition
        init();
		
	}]);