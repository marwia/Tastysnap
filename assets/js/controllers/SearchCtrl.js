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
        
        $scope.getValidRating = function (rating) {
            if (rating == 0)
                return null;
            return rating;
        }
        
        //ordina per
        $scope.selectedSortOption = "undefined";
        $scope.selectedSortMode = "ASC";
        $scope.sortOptions = ["nessun criterio", "commenti", "assaggi", "apprezzamenti",
                            "visualizzazioni", "difficoltà", "costo", "calorie", "tempo", "titolo"];
                            
        $scope.getSelectedSortOption = function () {
            switch ($scope.selectedSortOption) {
                case $scope.sortOptions[0]:
                    return null;

                case $scope.sortOptions[1]:
                    return "commentsCount";

                case $scope.sortOptions[2]:
                    return "trialsCount";

                case $scope.sortOptions[3]:
                    return "votesCount";

                case $scope.sortOptions[4]:
                    return "viewsCount";

                case $scope.sortOptions[5]:
                    return "difficulty";

                case $scope.sortOptions[6]:
                    return "cost";

                case $scope.sortOptions[7]:
                    return "calories";

                case $scope.sortOptions[8]:
                    return "preparationTime";

                case $scope.sortOptions[9]:
                    return "title";
            }
        }
        
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
        
        $scope.getSelectedProductIds = function () {
            var temp = [];
            $scope.selectedProducts.forEach(function(element) {
                temp.push(element.id);
            }, this);
            return temp;
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
        $scope.preparationTime = null;
        $scope.$watch("timeValue", function (newValue, oldValue) {
            if (newValue <= $scope.sliderOptions.floor ||
                newValue >= $scope.sliderOptions.ceil)
                $scope.preparationTime = null;
            else 
                $scope.preparationTime = newValue;
        })
        
        // update recipe list function
        $scope.updateRecipeList = function () {
            Recipe.advancedSearch($scope.q, 
                    $scope.selectedCategories, 
                    $scope.getSelectedProductIds(),
                    $scope.getValidRating($scope.difficultyRating),
                    $scope.getValidRating($scope.costRating),
                    $scope.getValidRating($scope.caloriesRating),
                    $scope.preparationTime,
                    $scope.getSelectedSortOption(), $scope.selectedSortMode,
                    null, true);
        }
        
        /**
         * Osserva le variazioni dei filtri di ricerca in modo da poter
         * aggiornare i risultati.
         */
        $scope.timer_1 = undefined;
        $scope.$watchCollection("selectedCategories", function(newValue, oldValue) {

            $timeout.cancel($scope.timer_1);
            $scope.timer_1 = $timeout(function () {
                toastr.success('Aggiorno...');
                $scope.updateRecipeList();
            }, 1500);
        });
        
        $scope.timer_2 = undefined;
        $scope.$watchCollection("selectedProducts", function(newValue, oldValue) {

            $timeout.cancel($scope.timer_2);
            $scope.timer_2 = $timeout(function () {
                toastr.success('Aggiorno prodotti...');
                $scope.updateRecipeList();
            }, 1500);
        });
        
        $scope.timer_3 = undefined;
        $scope.$watch("[difficultyRating, costRating, caloriesRating, timeValue]", function(newValue, oldValue) {
                
            $timeout.cancel($scope.timer_3);
            $scope.timer_3 = $timeout(function () {
                toastr.success('Aggiorno rating e tempo...');
                $scope.updateRecipeList();
            }, 1500);
        }, true);
        
        $scope.timer_4 = undefined;
        $scope.$watch("[selectedSortOption, selectedSortMode]", function(newValue, oldValue) {
                
            $timeout.cancel($scope.timer_4);
            $scope.timer_4 = $timeout(function () {
                toastr.success('Aggiorno criterio di ordine');
                $scope.updateRecipeList();
            }, 1000);
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