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
    'Search',
    'toastr',
    '$timeout',
    '$location',
    function ($scope, $state, $stateParams, Recipe, Product, Search, toastr, $timeout, $location) {

        // metodi di servizi
        $scope.searchProductsByName = Product.searchProductsByName;
        $scope.recipeCategories = Recipe.recipeCategories;
        $scope.advancedSearch = Recipe.advancedSearch;

        $scope.recipeFilters = {};

        // settings vari
        $scope.selectedProduct = undefined;

        // nutritional filtering settings
        $scope.comparatorTitles = ['<', '>'];
        $scope.nutrientTitles = ['energia', 'proteine', 'carboidrati', 'zuccheri', 'grassi'];
        $scope.nutrientUnits = ['kcal', 'g', 'g', 'g', 'g'];
        $scope.remainingNutrientTitles = $scope.nutrientTitles;

        $scope.addNutrientFilter = function () {
            var newFilter = {
                nutrient: undefined,
                comparator: undefined,
                value: undefined,
                nutrientIdx: undefined
            };

            $scope.recipeFilters.nutrientFilters.push(newFilter);
        }

        $scope.removeNutrientFilter = function (idx) {
            $scope.recipeFilters.nutrientFilters.splice(idx, 1);
        }

        $scope.getRemainingNutrientTitles = function () {
            var selectedNutrientTitles = $scope.recipeFilters.nutrientFilters.map(function (element) {
                return element.nutrient;
            });

            var remainingNutrientTitles = $scope.nutrientTitles.filter(function (element) {
                return selectedNutrientTitles.indexOf(element) < 0;
            })
            return remainingNutrientTitles;
        }

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
        };

        // sorting settings
        $scope.sortOptions = ["nessun criterio", "commenti", "assaggi", "apprezzamenti",
            "visualizzazioni", "difficoltà", "costo", "calorie", "tempo", "titolo",
            "energia", "proteine", "carboidrati", "zuccheri", "grassi"];

        // funzione per scrivere i parametri di ricerca nella url  
        $scope.writeSearchFilters = function () {
            var filtersToWrite = {};

            /**
             * Eseguo una copia dei filtri perchè alcuni attributi
             * sono bindati al livello DOM (html)
             */
            angular.copy($scope.recipeFilters, filtersToWrite);
            // trasformo i filtri sui nutrienti in formato accettato dal server
            if (filtersToWrite.nutrientFilters.length > 0)
                filtersToWrite.nutrientFilters = filtersToWrite.nutrientFilters.map(addNutrientIdx);

            filtersToWrite.difficultyRating = getValidRating($scope.recipeFilters.difficultyRating);
            filtersToWrite.costRating = getValidRating($scope.recipeFilters.costRating);
            filtersToWrite.caloriesRating = getValidRating($scope.recipeFilters.caloriesRating);
            filtersToWrite.timeValue = getPreparationTime();
            filtersToWrite.selectedSortOptionIdx = $scope.sortOptions.indexOf($scope.recipeFilters.selectedSortOption)

            // scrivo nell'url
            Search.writeSearchFilters(filtersToWrite);
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

        /**
         * Funzione che modifica un oggetto di tipo "NutrientFilter"
         * aggiungendo l'indice del nutrient pescato dall'array dei titoli dei nutrienti.
         */
        var addNutrientIdx = function (nutrientFilter) {
            if (!nutrientFilter['nutrientIdx'])
                nutrientFilter['nutrientIdx'] = $scope.nutrientTitles.indexOf(nutrientFilter.nutrient)

            return nutrientFilter;
        }

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
        

        //$scope.$watch("[recipeFilters, selectedSortOption]", function (newValue, oldValue) {
        $scope.$watch("recipeFilters", function (newValue, oldValue) {
            if (newValue === oldValue) {
                console.log("called due initialization");
            } else if (newValue != oldValue) {
                $scope.writeSearchFilters();
                // visto che vi è stato un cambiamento eseguo un update dei titoli di nutrieni
                // disponibili all'uso
                // OSS.: l'init fa scattare questo pezzo di codice
                $scope.remainingNutrientTitles = $scope.getRemainingNutrientTitles();
            }
        }, true);


        var init = function () {
            // Ricavo la lista delle categorie di ricette
            Recipe.getAllRecipeCategories();
            // leggo i filtri scritti nella url   
            $scope.recipeFilters = Search.readSearchFilters();

            // se non presente nessun filtro, inizializzo
            if (!$scope.recipeFilters) {
                // vari filtri impostabili dall'utente
                $scope.recipeFilters = {
                    selectedProducts: [],
                    selectedCategories: [],
                    difficultyRating: undefined,
                    costRating: undefined,
                    caloriesRating: undefined,
                    timeValue: 0,
                    nutrientFilters: [],
                    // ordinamento
                    selectedSortMode: "ASC",
                    selectedSortOptionIdx: 0,
                    selectedSortOption: undefined
                };
            }
        }

        init();
    }]);