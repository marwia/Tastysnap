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
        $scope.busy = Notification.busy;
        Notification.registerForNotification();

        $scope.toggled = function (open) {
            if (open) {
                // non serve caricare le notifiche all'apertura perchè ci pensa la direttiva infiniteScroll
                //Notification.getAll('createdAt DESC', Notification.getRegistrationDate(), null);
                User.currentUser.lastSeen = new Date().toISOString();
            } else { // segnalo tutte le notifiche come lette (in stile Twitter)
                $scope.setAllRed();
            }
        };

        // Funzione per caricare le notifiche successive ogni volta che
        // si raggiunge la fine della lista delle notifiche
        $scope.nextNotifications = function () {
            if (!$scope.notifications || $scope.notifications.length == 0)
                Notification.getAll('createdAt DESC', Notification.getRegistrationDate(), null);
            else
                Notification.getAll(
                    'createdAt DESC', 
                    Notification.getRegistrationDate(), 
                    Notification.skip + 30);

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