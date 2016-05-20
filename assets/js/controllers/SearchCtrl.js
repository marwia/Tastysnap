/**
 * assets/js/controllers/SearchCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller per la ricerca avanzata di ricette, raccolte e persone.
 */
angular.module('SearchCtrl', []).controller('SearchCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'Recipe',
    'Collection',
    'User',
    'toastr',
    '$timeout',
    '$location',
    function ($scope, $state, $stateParams, Recipe, Collection, User, toastr, $timeout, $location) {

        // espongo le variabili usate allo scope
        $scope.q = $stateParams.q;// query di ricerca

        // result holders
        $scope.recipes = Recipe.recipes;
        $scope.collections = Collection.collections;
        $scope.users = User.users;

        // vari filtri impostabili dall'utente
        $scope.searchModel = undefined;

        // osserva le variazioni nella url e aggiorna i risultati della ricerca
        $scope.$on('$locationChangeSuccess', function (event) {
            $timeout.cancel($scope.timer_1);
            $scope.timer_1 = $timeout(function () {
                toastr.success('Aggiorno...');
                
                switch ($scope.searchModel) {
                    case 'recipe':
                        var recipeFilters = Recipe.readSearchFilters();
                        Recipe.advancedSearch($scope.q,
                            recipeFilters.selectedCategories,
                            Recipe.toIdArray(recipeFilters.selectedProducts),
                            recipeFilters.difficultyRating,
                            recipeFilters.costRating,
                            recipeFilters.caloriesRating,
                            recipeFilters.timeValue,
                            recipeFilters.selectedSortOptionIdx,
                            recipeFilters.selectedSortMode, null, true);
                        break;

                    case 'collection':
                        // TODO
                        break;

                    case 'user':
                        // TODO
                        break;
                }
            }, 500);
        })

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

        // salvo il test della ricerca
        $scope.writeQ = function () {
            $location.search("q", $scope.q);
        }
        
        // salvo il tipo di modello della ricerca
        $scope.writeM = function () {
            $location.search("m", $scope.searchModel);
        }

        var init = function () {
            // inizializzazione del controller
            $scope.searchModel = $location.search()["m"];
            if (!$scope.searchModel) $scope.searchModel = "recipe";
            // query per ricette
            Recipe.search($scope.q);
            // query per raccolte
            Collection.search($scope.q);
            // query per persone
            User.search($scope.q);
        };

        // and fire it after definition
        init();

    }]);