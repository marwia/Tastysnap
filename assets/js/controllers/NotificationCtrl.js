/**
 * assets/js/controllers/NavCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per la navbar, serve a esporre le funzioni
 * e gli oggetti del servizio per l'autenticazione durante
 * la gestione della navbar.
 */
angular.module('NotificationCtrl', []).controller('NotificationCtrl', [
    '$scope',
    '$sails',
    'Auth',
    function ($scope, $sails, Auth) {

        // Registro l'utente per la ricezione di notifiche
        $sails.request({
            method: 'post',
            url: "/api/v1/notification/register",
            headers: {
                'Authorization': 'Bearer ' + Auth.getToken()
            }
        }, function (resData, jwres) {
            if (jwres.error) {
                console.info(jwres); // => e.g. 403
                return;
            }
            console.log(jwres.statusCode); // => e.g. 200
        });

        // Watching for updates
        var messageHandler = $sails.on("message", function (message) {
            console.log('New message ::\n', message);
        });
        var messageHandler2 = $sails.on("connecteduser", function (message) {
            console.log('New message from connecteduser ::\n', message);
        });

        // Stop watching for updates
        $scope.$on('$destroy', function () {
            $sails.off('message', messageHandler);
        });
    }]);