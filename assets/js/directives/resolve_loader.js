/**
 * assets/js/directives/resolve_loader.js
 *
 * Resolve Loader Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Direttiva per mostrare un template html quando viene caricata
 * una pagina dell'applicazione.
 * 
 * Usaggio:
 *      <resolve-loader></resolve-loader>
 * 
 * Utile per test:
 *  delay: function($q, $timeout) {
        var delay = $q.defer();
        $timeout(delay.resolve, 60500);
        return delay.promise;
    },
 */
angular.module('sampleApp')
    .directive('resolveLoader', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

        return {
            restrict: 'E',
            replace: true,
            template: "<div class='vertical-center loading-message ng-hide'><div class='container'><rotating-plane-spinner></rotating-plane-spinner></div></div>",
            //templateUrl: 'templates/loading_message.html',
            link: function (scope, element) {
                
                $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                    console.log("stateChangeStart");

                    if (fromState.name != "") return;

                    $timeout(function () {
                        element.removeClass('ng-hide');
                    });
                });

                $rootScope.$on('$stateChangeSuccess', function () {
                    console.log("stateChangeSuccess");
                    element.addClass('ng-hide');
                });
            }
        };

    }]);