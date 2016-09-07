/**
 * assets/js/services/ActivityService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano 
 * le collezioni di ricette.
 */
angular.module('ActivityService', [])
    .factory('Activity', ['Auth', '$http', function (Auth, $http) {

        var server_prefix = '/api/v1';

        // service body
        var o = {
            activities: [],
            skip: 0,
            busy: false
        };

        /**
         * Metodo per ottenere le notifiche prima di una certa data.
         * Questo è utile per chiedere la lista di notifiche prima di essersi
         * connessi alla socket real time.
         */
        o.getList = function (order_by, beforeDate, skip, successCB, errorCB) {

            // segnalo che è in atto un caricamento
            if (o.busy) return;
            o.busy = true;

            var params = { "sort": order_by };

            if (beforeDate) {
                params["where"] = {
                    "createdAt": { "<=": beforeDate.toISOString() }
                };
            }
            console.log("passa");

            if (skip)
                params["skip"] = skip;

            // salvo lo stato del skip
            o.skip = skip;

            return $http.get(server_prefix + '/user/activity', { cache: true, params: params })
                .then(function (response) {
                    /*
                    if (!skip) {
                        o.notifications = [];
                    }
                    */

                    // filtro le notifiche scartando quelle con 'event' nullo
                    var tempArray = [];
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].event) {
                            tempArray.push(response.data[i]);
                        }
                    }
                    console.info(tempArray);
                    // vuole per forza 'extend'
                    //angular.extend(o.activities, tempArray);
                    for (var i in tempArray) {
                        // prevengo di inserire duplicati
                        if (o.activities.indexOf(tempArray[i]) == -1) {
                            o.activities.push(tempArray[i]);
                        }
                    }

                    // segnalo che il caricamento è terminato
                    o.busy = false;

                    if (successCB)
                        successCB(response);
                }, errorCB);
        };



        return o;
    }]);