/**
 * assets/js/controllers/SearchCollectionCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller per la ricerca avanzata di raccolte
 */
angular.module('SearchCollectionCtrl', []).controller('SearchCollectionCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'Collection',
    'Search',
    function ($scope, $state, $stateParams, Collection, Search) {

        $scope.collectionFilters = {};

        // sorting settings
        $scope.sortOptions = ["nessun criterio", "visualizzazioni", "follower", "ricette"];

        // funzione per scrivere i parametri di ricerca nella url  
        $scope.writeSearchFilters = function () {
            var filtersToWrite = {};

            /**
             * Eseguo una copia dei filtri perchè alcuni attributi
             * sono bindati al livello DOM (html)
             */
            angular.copy($scope.collectionFilters, filtersToWrite);

            filtersToWrite.selectedSortOptionIdx = $scope.sortOptions.indexOf($scope.collectionFilters.selectedSortOption)

            // scrivo nell'url
            Search.writeSearchFilters(filtersToWrite);
        }

        //$scope.$watch("[collectionFilters, selectedSortOption]", function (newValue, oldValue) {
        $scope.$watch("collectionFilters", function (newValue, oldValue) {
            if (newValue === oldValue) {
                console.log("called due initialization");
            } else if (newValue != oldValue) {
                $scope.writeSearchFilters();
            }
        }, true);


        var init = function () {
            // leggo i filtri scritti nella url   
            $scope.collectionFilters = Search.readSearchFilters();

            // se non presente nessun filtro, inizializzo
            if (!$scope.collectionFilters) {
                // vari filtri impostabili dall'utente
                $scope.collectionFilters = {
                    // ordinamento
                    selectedSortMode: "ASC",
                    selectedSortOptionIdx: 0,
                    selectedSortOption: undefined
                };
            }
        }

        init();
    }]);