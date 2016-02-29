/**
 * assets/js/directives/collection_card.js
 *
 * Recipe Card Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Semplice direttiva per mostrare un collection card passando una collection come 
 * parametro. In gergo si chiama direttiva con scope isolato.
 */

angular.module('sampleApp')
    .directive('collectionCard', ['User', function (User) {
        
        return {
            restrict: 'E',
            //scope: true,
            
            scope: {
                collection: '=collection',
            },
            
            //controller: 'CollectionCtrl',
            link: function (scope, element, attrs) {
                scope.getUserProfileImage = User.getUserProfileImage;
            },
            templateUrl: 'templates/collection_card.html'
        };
    }]);