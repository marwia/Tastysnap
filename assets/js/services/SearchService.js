/**
 * assets/js/services/SearchService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano le ricette.
 */
angular.module('SearchService', [])
    .factory('Search', ['$http', '$location', function($http, $location) {
        
        var o = {};
        
        o.writeSearchFilters = function (filters) {
            // scrivo i filtri di ricerca nel url
            var encodedString = btoa(angular.toJson(filters));
            $location.search("f", encodedString);
        };
        
        o.readSearchFilters = function () {
            // leggo i filtri dall'url
            var encodedFilters = $location.search()["f"];
            if (encodedFilters) {
                var decodedFiltersString = atob(encodedFilters);
                var decodedFilters = angular.fromJson(decodedFiltersString);
                return decodedFilters;
            }
            return null;
        };

        return o;
}]);