/**
 * assets/js/directives/hide_during_resolve.js
 *
 * Hide During Resolve Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Direttiva per nascondere un elemento html
 * durante la procedura di resolve del router.
 * 
 * E' possibile anche specifica lo stato di destinazione.
 * 
 * Usaggio:
 *      <div hide-during-resolve to-state="'string'+variable" class="alert alert-info">
            <strong>Not Loading.</strong>
            Please not hold.
        </div>
 */
angular.module('sampleApp')
    .directive('hideDuringResolve', ['$rootScope', '$state', function($rootScope, $state) {

  return {
    scope: {
                toState: '=',
            },
            
    link: function(scope, element) {
      
      var unregister = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        var redirectUrl = $state.href(toState.name, toParams);
          
        if (scope.toState && redirectUrl != scope.toState) return;
        
        element.addClass('ng-hide');
      });

      scope.$on('$destroy', unregister);
    }
  };
}]);