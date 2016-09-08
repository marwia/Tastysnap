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

        $scope.events = [{
            badgeClass: 'info',
            badgeIconClass: 'glyphicon-check',
            title: 'First heading',
            content: 'Some awesome content.'
        }, {
                badgeClass: 'warning',
                badgeIconClass: 'glyphicon-credit-card',
                title: 'Second heading',
                content: 'More awesome content.'
            }];

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
            // caricamento iniziale delle notifiche -> NON SERVE
        }

        init();


    }]);