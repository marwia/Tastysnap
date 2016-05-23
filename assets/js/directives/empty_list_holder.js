/**
 * assets/js/directives/empty_list_holder.js
 *
 * Empty List Placeholder Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Semplice direttiva per mostrare un placeholder con un messaggio
 * che comunica che una lista di elementi è vuota.
 */

angular.module('sampleApp')
    .directive('emptyListHolder', [ function () {
        
        return {
            restrict: 'E',
            //scope: true,
            
            scope: {
                msg: '=',
            },
            
            link: function (scope, element, attrs) {
                //nothing...
                console.log(scope.msg);
            },
            templateUrl: 'templates/empty_list_holder.html'
        };
    }]);