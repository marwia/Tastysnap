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
    'Search',
    'toastr',
    '$timeout',
    '$location',
    function ($scope, $state, $stateParams, Recipe, Collection, User, Search, toastr, $timeout, $location) {

        // espongo le variabili usate allo scope

        // inizializzazione della query di ricerca 
        $scope.q = $stateParams.q;// query di ricerca effettuata
        $scope.qToWrite = $stateParams.q; // query nella input

        // result holders
        $scope.recipes = Recipe.recipes;
        $scope.collections = Collection.collections;
        $scope.users = User.users;

        // vari filtri impostabili dall'utente
        $scope.searchModel = undefined;

        /**
         * Funzione che serve a rifare la query di ricerca avanzata.
         */
        function reloadData() {
            // aggiorno la q dalla url
            $scope.q = $stateParams.q;

            // annullo l'eventule operazione di refresh in atto
            $timeout.cancel($scope.search_timer);

            // eseguo un refresh se l'url è cambiata ma sono ancora nella pagina di ricerca
            if ($location.path().indexOf("app/search") > -1)
                $scope.search_timer = $timeout(function () {
                    toastr.success('Aggiorno...');

                    // ricavo i filtri dalla url
                    var searchFilters = Search.readSearchFilters();
                    if (!searchFilters) searchFilters = {};
                    console.info("search: ", searchFilters);

                    switch ($scope.searchModel) {
                        case 'recipe':
                            Recipe.advancedSearch({
                                title: $scope.q,
                                categoryArray: searchFilters.selectedCategories,
                                productsIdsArray: Recipe.toIdArray(searchFilters.selectedProducts),
                                difficulty: searchFilters.difficultyRating,
                                cost: searchFilters.costRating,
                                calories: searchFilters.caloriesRating,
                                maxTime: searchFilters.timeValue,
                                nutrientFiltersArray: searchFilters.nutrientFilters,
                                sort_by: searchFilters.selectedSortOptionIdx,
                                sort_mode: searchFilters.selectedSortMode,
                                reset: true
                                });
                            break;

                        case 'collection':
                            Collection.search($scope.q,
                                searchFilters.selectedSortOptionIdx,
                                searchFilters.selectedSortMode, null, true);
                            break;

                        case 'user':
                            User.search($scope.q, null, true);
                            break;
                    }
                }, 750);
        }

        // osserva le variazioni nella url e aggiorna i risultati della ricerca
        $scope.$on('$locationChangeSuccess', reloadData);

        // espongo i wrapper per i bottoni 'carica altro'
        $scope.loadMoreRecipes = function (skip, successCB, errorCB) {
            //Recipe.search($scope.q, skip, successCB, errorCB);
        }

        $scope.loadMoreCollections = function (skip, successCB, errorCB) {
            //Collection.search($scope.q, skip, successCB, errorCB);
        }

        $scope.loadMoreUsers = function (skip, successCB, errorCB) {
            //User.search($scope.q, skip, successCB, errorCB);
        }

        // salvo il test della ricerca
        $scope.writeQ = function () {
            $location.search("q", $scope.qToWrite);
        }

        // salvo il tipo di modello della ricerca
        $scope.writeM = function () {
            $location.search("m", $scope.searchModel);
        }

        var init = function () {
            // inizializzazione del controller
            $scope.searchModel = $location.search()["m"];
            if (!$scope.searchModel) $scope.searchModel = "recipe";

            // faccio la query per la prima volta
            reloadData();
        };

        // and fire it after definition
        init();

    }]);