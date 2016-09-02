/**
 * assets/js/controllers/ActivitesCtrl.js
 *
 * Mariusz Wiazowski
 *
 */

angular.module('ActivitesCtrl', []).controller('ActivitesCtrl', [
    '$scope',
    function ($scope) {

        // piccolo script per generare un numero di attività casuali, (esempio da eliminare)
        $scope.range = function(min, max, step){
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) input.push(i);
            return input;
        };


    }]);