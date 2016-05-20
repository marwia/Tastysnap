/**
 * assets/js/controllers/SearchRecipeCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller per la ricerca avanzata di ricette
 */
angular.module('SearchRecipeCtrl', []).controller('SearchRecipeCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'Recipe',
    'Product',
    'toastr',
    '$timeout',
    '$location',
    function ($scope, $state, $stateParams, Recipe, Product, toastr, $timeout, $location) {
        
        // metodi di servizi
        $scope.searchProductsByName = Product.searchProductsByName;
        $scope.recipeCategories = Recipe.recipeCategories;
        $scope.advancedSearch = Recipe.advancedSearch;
        
        // vari filtri impostabili dall'utente
        $scope.recipeFilters = {
            selectedProducts: [],
            selectedCategories: [],
            difficultyRating: undefined,
            costRating: undefined,
            caloriesRating: undefined,
            timeValue: 0,
            // ordinamento
            selectedSortMode: "ASC",
            selectedSortOptionIdx: 0
        }
        
        // settings vari
        $scope.selectedProduct = undefined;
        
        
        // rating settings
        $scope.rate = 0;
        $scope.max = 5;
        $scope.isReadonly = false;
        $scope.difficultyTitles = ['molto difficile', 'difficile', 'normale', 'facile', 'molto facile'];
        $scope.costTitles = ['molto costosa', 'costosa', 'normale', 'economica', 'molto economica'];
        $scope.caloriesTitles = ['molto calorica', 'calorica', 'normale', 'leggera', 'molto leggera'];

        // time slider settings
        $scope.sliderOptions = {
            floor: 0,
            ceil: 120
        }
        
        // sorting settings
        $scope.selectedSortOption = undefined;
        $scope.sortOptions = ["nessun criterio", "commenti", "assaggi", "apprezzamenti",
            "visualizzazioni", "difficoltà", "costo", "calorie", "tempo", "titolo"];
            
        $scope.writeSearchFilters = function () {
            var filtersToWrite = {};
            angular.copy($scope.recipeFilters, filtersToWrite);
            
            filtersToWrite.difficultyRating = getValidRating($scope.recipeFilters.difficultyRating);
            filtersToWrite.costRating = getValidRating($scope.recipeFilters.costRating);
            filtersToWrite.caloriesRating = getValidRating($scope.recipeFilters.caloriesRating);
            filtersToWrite.timeValue = getPreparationTime();
            filtersToWrite.selectedSortOptionIdx = $scope.sortOptions.indexOf($scope.selectedSortOption)
            
            Recipe.writeSearchFilters(filtersToWrite);
        }
        
        var getPreparationTime = function () {
            if ($scope.recipeFilters.timeValue <= $scope.sliderOptions.floor ||
                $scope.recipeFilters.timeValue >= $scope.sliderOptions.ceil)
                return null;
            else
                return $scope.recipeFilters.timeValue;
        }

        var getValidRating = function (rating) {
            if (rating == 0)
                return null;
            return rating;
        };
        
        // filtraggio in base alle categorie di ricette
        $scope.toggleCategory = function (category) {
            // visto che è un array di stringhe uso la seguente funzione...
            var idx = $scope.recipeFilters.selectedCategories.indexOf(category)
            if (idx > -1) {// trovato
                $scope.recipeFilters.selectedCategories.splice(idx, 1);
            } else {// non trovato
                $scope.recipeFilters.selectedCategories.push(category);
            }
        }
        
        // filtraggio in base ai prodotti
        $scope.onProductSelect = function (product) {
            var found = false;
            $scope.recipeFilters.selectedProducts.forEach(function (element) {
                if (element.id == product.id) {
                    found = true;
                    return;
                }
            }, this);

            if (!found)
                $scope.recipeFilters.selectedProducts.push(product);
        }

        $scope.removeProduct = function (product_index) {
            $scope.recipeFilters.selectedProducts.splice(product_index, 1);
        }
        
        $scope.$watch("[recipeFilters, selectedSortOption]", function(newValue, oldValue) {
            if (newValue != oldValue)
                $scope.writeSearchFilters();
        }, true);

        
        var init = function () {
            // Ricavo la lista delle categorie di ricette
            Recipe.getAllRecipeCategories();
            $scope.recipeFilters = Recipe.readSearchFilters();
            if (!$scope.recipeFilters) {
                // vari filtri impostabili dall'utente
                $scope.recipeFilters = {
                    selectedProducts: [],
                    selectedCategories: [],
                    difficultyRating: undefined,
                    costRating: undefined,
                    caloriesRating: undefined,
                    timeValue: 0,
                    // ordinamento
                    selectedSortMode: "ASC",
                    selectedSortOptionIdx: 0
                }
            }
        }
        
        init();
    }]);