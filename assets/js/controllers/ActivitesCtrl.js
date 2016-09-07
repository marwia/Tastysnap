/**
 * assets/js/controllers/ActivitesCtrl.js
 *
 * Mariusz Wiazowski
 *
 */

angular.module('ActivitesCtrl', []).controller('ActivitesCtrl', [
    '$scope',
    'Activity',
    function ($scope, Activity) {

        $scope.activities = Activity.activities;
        $scope.busy = Activity.busy;

        // piccolo script per generare un numero di attività casuali, (esempio da eliminare)
        $scope.range = function(min, max, step){
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) input.push(i);
            return input;
        };

        // Funzione per caricare le notifiche successive ogni volta che
        // si raggiunge la fine della lista delle notifiche
        $scope.nextActivites = function () {
            if (!$scope.activities || $scope.activities.length == 0)
                 Activity.getList('createdAt DESC', null, null);
            else
                 Activity.getList(
                    'createdAt DESC', 
                    Notification.getRegistrationDate(), 
                    Notification.skip + 30);

        };

        var init = function () {
            // caricamento iniziale delle notifiche
            Activity.getList('createdAt DESC', null, null);
        }

        init();


    }]);