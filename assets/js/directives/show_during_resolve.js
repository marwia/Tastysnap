/**
 * assets/js/directives/show_during_resolve.js
 *
 * Show During Resolve Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Direttiva per mostrare un elemento html
 * durante la procedura di resolve del router.
 * 
 * E' possibile anche specifica lo stato di destinazione.
 * 
 * Usaggio:
 *      <div show-during-resolve class="alert alert-info">
            <strong>Loading.</strong>
            Please hold.
        </div>
 */
angular.module('sampleApp')
    .directive('showDuringResolve', ['$rootScope', '$state', function($rootScope, $state) {

  return {
    scope: {
                toState: '=',
            },
            
    link: function(scope, element) {

      element.addClass('ng-hide');

      var unregister = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        var redirectUrl = $state.href(toState.name, toParams);
          
        if (scope.toState && redirectUrl != scope.toState) return;
        
        element.removeClass('ng-hide');
      });

      scope.$on('$destroy', unregister);
    }
  };
}]);