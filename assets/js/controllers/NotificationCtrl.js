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
    function ($scope, $sails) {

        // Watching for updates
        var messageHandler = $sails.on("message", function (message) {
            console.log('New message ::\n', message);
        });

        // Stop watching for updates
        $scope.$on('$destroy', function () {
            $sails.off('message', messageHandler);
        });
    }]);