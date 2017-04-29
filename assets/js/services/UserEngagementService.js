// assets/js/services/UserEngagementService.js
// Dichiaro un service per gestire la motivazione e stimolazione dell'utente

angular.module('UserEngagementService', [])
    .factory('UserEngagement', ['$http', '$window', '$document', function ($http, $window, $document) {

        var server_prefix = '/api/v1';

        // service body    
        var o = {
            date_strings: [
                'create_first_recipe_modal_date',
                'create_first_collection_modal_date',
            ]
        };

        // Funzione per salvare la data di visualizzazione della modale per la creazione della prima ricetta
        o.saveDate = function (date_string, date) {
            $window.localStorage[date_string] = date;
        };

        // Funzione per caricare la data salvata in locale
        o.getDate = function (date_string) {
            return $window.localStorage[date_string];
        };

        return o;
    }]);