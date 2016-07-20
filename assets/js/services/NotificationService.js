/**
 * assets/js/services/NotificationService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano 
 * le collezioni di ricette.
 */
angular.module('NotificationService', [])
    .factory('Notification', ['$sails', 'Auth', '$http', '$window', function ($sails, Auth, $http, $window) {

        var server_prefix = '/api/v1';

        // service body
        var o = {
            notifications: []
        };

        // Funzione per salvare il token in locale
        o.saveRegistrationDate = function () {
            $window.localStorage['registration-date'] = new Date();
        };

        // Funzione per caricare il token salvato in locale
        o.getRegistrationDate = function () {
            return new Date($window.localStorage['registration-date']);
        }

        /**
         * Registra l'utente loggato alla socket delle notifiche.
         */
        o.registerForNotification = function () {
            // Registro l'utente per la ricezione di notifiche
            $sails.request({
                method: 'post',
                url: server_prefix + "/user/notification/register",
                headers: {
                    'Authorization': 'Bearer ' + Auth.getToken()
                }
            }, function (resData, jwres) {
                if (jwres.error) {
                    console.info(jwres); // => e.g. 403
                    return;
                }
                console.log(jwres.statusCode); // => e.g. 200
                o.saveRegistrationDate();
            });

            // Watching for updates
            var messageHandler = $sails.on("user", function (message) {
                console.log('New message to this user ::\n', message);
                // Aggiungi la notifica alla coda
                o.notifications.push(message.data);
            });
        };

        /**
         * Metodo per ottenere le notifiche prima di una certa data.
         * Questo è utile per chiedere la lista di notifiche prima di essersi
         * connessi alla socket real time.
         */
        o.getAll = function (order_by, beforeDate, skip, successCB, errorCB) {
            console.log("load notifications");
            var params = { "sort": order_by };

            if (beforeDate) {
                params["where"] = {
                    "createdAt": { "<=": beforeDate.toISOString()}
                };
            }
            
            return $http.get(server_prefix + '/user/notification', {params: params})
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
                angular.extend(o.notifications, tempArray);

                if (successCB)
                    successCB(response);
            }, errorCB);
        };

        /**
         * Servizio per creare una ricetta.
         */
        o.setRed = function (idArray, successCB) {
            return $http.put(
                server_prefix + '/user/notification/red',
                { notificationIds: idArray })
                .then(function (response) {

                    if (successCB)
                        successCB(response);

                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };



        return o;
    }]);