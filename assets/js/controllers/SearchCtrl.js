/**
 * assets/js/controllers/AuthCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per esporre le funzioni di servizio di autenticazione.
 * Questo espone nello scope l'oggetto user e due metodi per fare il login
 * o la registrazione.
 */
angular.module('SearchCtrl', []).controller('SearchCtrl', [
	'$scope',
	'$state',
    '$stateParams',
    'Recipe',
    'Collection',
    'User',
    'Product',
    'toastr',
    '$timeout',
	function($scope, $state, $stateParams, Recipe, Collection, User, Product, toastr, $timeout){
		
        // espongo le variabili usate allo scope
        $scope.q = $stateParams.q;
        $scope.recipes = Recipe.recipes;
        $scope.collections = Collection.collections;
        $scope.users = User.users;
        $scope.searchProductsByName = Product.searchProductsByName;
        
        $scope.recipeCategories = Recipe.recipeCategories;
        
        $scope.advancedSearch = Recipe.advancedSearch;
        
        // vari filtri impostabili dall'utente
        $scope.selectedProducts = [];
        $scope.selectedProduct = undefined;
        
        $scope.selectedCategories = [];
        $scope.difficultyRating = undefined;
        $scope.costRating = undefined;
        $scope.caloriesRating = undefined;
        
        //ordina per
        $scope.selectedSortOption = "undefined";
        $scope.selectedSortMode = "ASC";
        $scope.sortOptions = ["casuale", "numero commenti", "numero assaggi", "numero apprezzamenti",
                            "numero visualizzazioni", "difficoltà", "costo", "calorie"];
        
        // espongo i wrapper per i bottoni 'carica altro'
        $scope.loadMoreRecipes = function (skip, successCB, errorCB) {
            Recipe.search($scope.q, skip, successCB, errorCB);
        }
        
        $scope.loadMoreCollections = function (skip, successCB, errorCB) {
            Collection.search($scope.q, skip, successCB, errorCB);
        }
        
        $scope.loadMoreUsers = function (skip, successCB, errorCB) {
            User.search($scope.q, skip, successCB, errorCB);
        }
        
        // filtraggio in base alle categorie di ricette
        $scope.toggleCategory = function (category) {
            // visto che è un array di stringhe uso la seguente funzione...
            var idx = $scope.selectedCategories.indexOf(category)
            if (idx > -1) {//trovato
                $scope.selectedCategories.splice(idx, 1);
            } else {//non trovato
                $scope.selectedCategories.push(category);
            }
                
        }
        
        // filtraggio in base ai prodotti
        
        $scope.onProductSelect = function (product) {
            var found = false;
            $scope.selectedProducts.forEach(function(element) {
                if (element.id == product.id) {
                    found = true;
                    return;
                }
            }, this);
            
            if (!found)
                $scope.selectedProducts.push(product);
        }
        
        $scope.removeProduct = function (product_index) {
            $scope.selectedProducts.splice(product_index, 1);
        }
        
        // rating settings
        $scope.rate = 0;
        $scope.max = 5;
        $scope.isReadonly = false;
        $scope.difficultyTitles = ['molto difficile', 'difficile', 'normale', 'facile', 'molto facile'];
        $scope.costTitles = ['molto costosa', 'costosa', 'normale', 'economica', 'molto economica'];
        $scope.caloriesTitles = ['molto calorica', 'calorica', 'normale', 'leggera', 'molto leggera'];
        
        // time slider settings
        $scope.timeValue = 0;
        $scope.sliderOptions = {
                floor: 0,
                ceil: 120
            };
        
        /**
         * Osserva le variazioni dei filtri di ricerca in modo da poter
         * aggiornare i risultati.
         */
        $scope.timer_1 = undefined;
        $scope.$watchCollection("selectedCategories", function(newValue, oldValue) {

            $timeout.cancel($scope.timer_1);
            $scope.timer_1 = $timeout(function () {
                toastr.success('Aggiorno...');
                $scope.advancedSearch($scope.q, $scope.selectedCategories);
            }, 1500);
        });
        
        $scope.timer_2 = undefined;
        $scope.$watchCollection("selectedProducts", function(newValue, oldValue) {

            $timeout.cancel($scope.timer_2);
            $scope.timer_2 = $timeout(function () {
                toastr.success('Aggiorno prodotti...');
            }, 1500);
        });
        
        $scope.timer_3 = undefined;
        $scope.$watch("[difficultyRating, costRating, caloriesRating]", function(newValue, oldValue) {

            $timeout.cancel($scope.timer_3);
            $scope.timer_3 = $timeout(function () {
                toastr.success('Aggiorno rating...');
            }, 1500);
        }, true);
        
        var init = function () {
            // inizializzazione del controller
            // query per ricette
            Recipe.search($scope.q);
            // query per raccolte
            Collection.search($scope.q);
            // query per persone
            User.search($scope.q);
            
            // Ricavo la lista delle categorie di ricette
            Recipe.getAllRecipeCategories();
        };
        // and fire it after definition
        init();
        
	}]);