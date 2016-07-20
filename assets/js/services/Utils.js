/**
 * assets/js/services/NotificationService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano 
 * le collezioni di ricette.
 */
angular.module('Utils', [])
    .factory('Utils', ['$http', function ($http) {

        var server_prefix = '/api/v1';

        // service body
        var o = {
        };

        //mi ritorna la data leggibile
        o.formatDate = function (date) {
            moment.locale("it");
            return moment(date).fromNow();
        };

        return o;
    }]);