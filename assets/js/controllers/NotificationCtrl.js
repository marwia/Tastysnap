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
    'Notification',
    'User',
    function ($scope, $sails, Notification, User) {

        // service body
        $scope.notifications = Notification.notifications;
        Notification.registerForNotification();

        $scope.toggled = function (open) {
            if (open) {
                //Notification.getAll('createdAt DESC', Notification.getRegistrationDate(), null);
                User.currentUser.lastSeen = new Date().toISOString();
            }
        };

        $scope.countNew = function () {
            var fromDate = User.currentUser.lastSeen;
            var count = 0;
            $scope.notifications.forEach(function(element) {
                if (!element.red && element.createdAt > fromDate) count++;
            }, this);
            return count;
        };

        $scope.setAllRed = function () {
            // creo un array di id delle notifiche da segnalare
            var ids = [];
            $scope.notifications.forEach(function (element) {
                ids.push(element.id);
            });

            Notification.setRed(ids, function (response) {
                $scope.notifications.forEach(function (element) {
                    element.red = true;
                });
            });
        };


        

        // Stop watching for updates
        /*
        $scope.$on('$destroy', function () {
            $sails.off('message', messageHandler);
        });
        */
    }]);