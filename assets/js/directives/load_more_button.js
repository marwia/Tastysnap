/**
 * assets/js/directives/load_more_button.js
 *
 * Load More Elements Button Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Direttiva usata per mostrare un pulsante interattivo 
 * per caricare olteriori elementi dal server, particolarmente
 * utile in caso di paginazione.
 * Attenzione, i 3 parametri della direttiva sono fondamentali. 
 * Ma il più importante è quello della funzione che dovrà
 * essere chiamata per caricare ulteriori elementi, infatti 
 * questa funzione deve essere passata in questo modo:
 *      --> getAll(skip, successCB, errorCB)
 */

angular.module('sampleApp')
    .directive('loadMoreButton', [function () {

        return {
            restrict: 'E',
            // isolated scope
            scope: {
                /**
                 * elementi attualmente caricati
                 */
                elements: '=',
                /**
                 * funzione da fare eseguire al click sul pulsante
                 */
                onClickFunction: '&',
                /**
                 * quanti richiedere ogni volta, il passo
                 */
                step: '=',
                /**
                 * qui non si dichiarano ne funzioni ne
                 * variabili, questo scope serve solo
                 * al passaggio di variabili/funzioni tra
                 * il parent scope e la direttiva stessa.
                 */
            },
            controller: ['$scope', function ($scope) {
                
                $scope.skipValue = 0;
                $scope.isLoading = false;
                
                $scope.loadMore = function () {
                    $scope.skipValue += $scope.step;
                    $scope.isLoading = true;
   
                    $scope.onClickFunction(
                        {
                            skip: $scope.skipValue,
                            successCB: function (response) {
                                $scope.isLoading = false;
                            }
                        });
                };
                
                $scope.hasMoreElements = function () {
                    if ($scope.elements) {
                        return $scope.elements.length % $scope.step == 0;
                    }
                    else {
                        return false;
                    }
                };
            }],
            templateUrl: 'templates/load_more_button.html'
        };
    }]);