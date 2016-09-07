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

        /**
         * Funzione che converte una array di colori RGB in hex.
         * Fonte: http://codepen.io/TepigMC/pen/jnmkv
         */
        o.rgbToHex = function (rgb) {
            var r = parseInt(rgb[0]),
                g = parseInt(rgb[1]),
                b = parseInt(rgb[2]);
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        };

        // Ritorna il colore dominante del canvas che contiene
        // la prima delle immagini caricate
        o.getCoverImageDominanatColor = function (canvas) {
            var colorThief = new ColorThief();
            return o.rgbToHex(colorThief.getColor(canvas))
        };

        //mi ritorna la data leggibile
        o.formatDate = function (date) {
            moment.locale("it");
            return moment(date).fromNow();
        };

        return o;
    }]);